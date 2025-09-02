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

    // Handle form submission
    if (taskForm) {
        taskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(taskForm);
            const taskData = {
                task: formData.get('task'),
                priority: formData.get('priority'),
                creation_date: formData.get('creation_date')
            };

            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    taskForm.reset();
                    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                    // Immediately reload tasks so recent tasks updates
                    await loadTasks();
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        });
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
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
        });
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
