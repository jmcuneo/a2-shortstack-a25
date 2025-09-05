// FRONT-END (CLIENT) JAVASCRIPT HERE

// const submit = async function( event ) {
//   // stop form submission from trying to load
//   // a new .html page for displaying results...
//   // this was the original browser behavior and still
//   // remains to this day
//   event.preventDefault()

//task display + loading
const loadTasks = async () => {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  const taskTableBody = document.getElementById('taskTableBody');

  //clear table
  taskTableBody.innerHTML = '';

  tasks.forEach((task, index) => {
    const row = document.createElement('tr');

    //priority update dropdown
    const priorities = ["Urgent", "High", "Medium", "Low"];
    let optionsHtml = priorities.map(p =>
        //don't update if its same
        `<option value="${p}" ${task.priority === p ? 'selected' : ''}>${p}</option>`
    ).join('');

    //add priority to class for styling
    const priorityCellHTML = `
      <td>
        <select class="priority-select priority-${task.priority}" data-index="${index}">
          ${optionsHtml}
        </select>
      </td>
    `;

    const createdDate = new Date(task.dateCreated).toLocaleDateString();
    const deadlineDate = new Date(task.suggestedDeadline).toLocaleDateString();

    //display task data, priority format different for styling on value
    row.innerHTML = `
      <td>${task.task}</td>
      ${priorityCellHTML}
      <td>${createdDate}</td>
      <td>${deadlineDate}</td>
      <td><input type="checkbox" class="complete-checkbox" data-index="${index}"></td>
    `;

    taskTableBody.appendChild(row);
  });
};

// form submission
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const taskInput = document.querySelector("#task");
  const priorityInput = document.querySelector('input[name="priority"]:checked');

  //only add task if its not blank
  if(taskInput.value !== "") {
    const json = {
      task: taskInput.value,
      priority: priorityInput.value
    };

    const body = JSON.stringify(json);

    await fetch("/submit", {
      method: "POST",
      body
    });

    //clear form, update task display
    taskInput.value = "";
    loadTasks();
  }
};

const completeTask = async function(event) {
  if(event.target.classList.contains('complete-checkbox')) {
    const taskIndex = event.target.dataset.index;

    const json = { index: taskIndex };
    const body = JSON.stringify(json);

    await fetch("/delete", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body
    });

    //update to reflect delete
    loadTasks();
  }
}

const updatePriority = async function(event) {
  if (event.target.classList.contains('priority-select')) {
    const taskIndex = event.target.dataset.index;
    const newPriority = event.target.value;

    const json = { index: taskIndex, priority: newPriority };
    const body = JSON.stringify(json);

    await fetch("/update", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body
    });

    // update task list
    loadTasks();
  }
};

window.onload = function() {
  const form = document.querySelector("#todoForm");
  form.onsubmit = submit;


  const taskTableBody = document.getElementById('taskTableBody');
  taskTableBody.onclick = completeTask;
  taskTableBody.onchange = updatePriority;

  // load saved tasks
  loadTasks();
};