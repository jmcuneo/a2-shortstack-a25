document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const tasksTableBody = document.getElementById('tasksTableBody');
    
    // Set default date to today
    const dateInput = document.getElementById('creation_date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Load tasks on page load
    loadTasks();

    let editMode = false;
    let editTaskId = null;

    // Helper to get the form (works for both pages)
    function getTaskForm() {
        return document.getElementById('taskForm');
    }

    // Helper to get form fields (works for both pages)
    function getFormFields() {
        const form = getTaskForm();
        if (!form) return {};
        return {
            task: form.querySelector('[name="task"]'),
            priority: form.querySelector('[name="priority"]'),
            creation_date: form.querySelector('[name="creation_date"]'),
            submitBtn: form.querySelector('button[type="submit"]'),
            cancelBtn: document.getElementById('cancelEditBtn')
        };
    }

    // Handle form submission
    const form = getTaskForm();
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fields = getFormFields();
            const taskData = {
                task: fields.task.value,
                priority: fields.priority.value,
                creation_date: fields.creation_date.value
            };

            try {
                if (editMode && editTaskId !== null) {
                    // Edit existing task
                    const response = await fetch(`/api/tasks/${editTaskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(taskData)
                    });
                    if (response.ok) {
                        resetFormMode();
                        await loadTasks();
                    }
                } else {
                    // Add new task
                    const response = await fetch('/api/tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(taskData)
                    });

                    if (response.ok) {
                        form.reset();
                        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                        await loadTasks();
                    }
                }
            } catch (error) {
                console.error('Error adding/updating task:', error);
            }
        });

        // Cancel edit button (results page only)
        const fields = getFormFields();
        if (fields.cancelBtn) {
            fields.cancelBtn.addEventListener('click', function() {
                resetFormMode();
            });
        }
    }

    // Check if we're on results page and force load
    if (window.location.pathname === '/results') {
        setTimeout(loadTasks, 100);
    }

    // Load and display tasks
    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            
            if (taskList) {
                displayRecentTasks(tasks.slice(-3));
            }
            
            if (tasksTableBody) {
                displayAllTasks(tasks);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    // Display recent tasks on home page
    function displayRecentTasks(tasks) {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p>No tasks yet. Add your first task!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task-item task-priority-${task.priority}`;
            taskDiv.innerHTML = `
                <strong>${task.task}</strong><br>
                <small>Priority: ${task.priority.toUpperCase()} | Deadline: ${task.deadline}</small>
            `;
            taskList.appendChild(taskDiv);
        });
    }

    // Display all tasks in table
    function displayAllTasks(tasks) {
        if (!tasksTableBody) return; // Guard clause for results page
        
        tasksTableBody.innerHTML = '';
        
        if (tasks.length === 0) {
            const row = tasksTableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.textContent = 'No tasks found';
            cell.style.textAlign = 'center';
            return;
        }

        tasks.forEach(task => {
            const row = tasksTableBody.insertRow();
            row.innerHTML = `
                <td>${task.task}</td>
                <td><span class="priority-${task.priority}">${task.priority.toUpperCase()}</span></td>
                <td>${task.creation_date}</td>
                <td>${task.deadline}</td>
                <td>
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
        });

        // Attach edit event listeners
        const editButtons = tasksTableBody.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = btn.getAttribute('data-id');
                const task = tasks.find(t => t.id == id);
                const form = getTaskForm();
                const fields = getFormFields();
                if (task && form && fields.task && fields.priority && fields.creation_date) {
                    fields.task.value = task.task;
                    fields.priority.value = task.priority;
                    fields.creation_date.value = task.creation_date;
                    editMode = true;
                    editTaskId = task.id;
                    if (fields.submitBtn) fields.submitBtn.textContent = 'Update Task';
                    // Show form if on results page
                    if (window.location.pathname === '/results') {
                        form.style.display = '';
                        if (fields.cancelBtn) fields.cancelBtn.style.display = '';
                    }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Hide edit form by default on results page
        if (window.location.pathname === '/results') {
            const form = getTaskForm();
            if (form && !editMode) form.style.display = 'none';
        }
    }

    function resetFormMode() {
        editMode = false;
        editTaskId = null;
        const form = getTaskForm();
        const fields = getFormFields();
        if (form) {
            form.reset();
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
            if (fields.submitBtn) fields.submitBtn.textContent = 'Add Task';
            // Hide form if on results page
            if (window.location.pathname === '/results') {
                form.style.display = 'none';
            }
        }
    }

    // Delete task function (global scope for onclick)
    window.deleteTask = async function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    loadTasks();
                } else {
                    alert('Error deleting task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task');
            }
        }
    };
});
