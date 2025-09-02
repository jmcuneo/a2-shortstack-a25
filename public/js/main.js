// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const title = document.querySelector("#taskTitle"),
    taskDescription = document.querySelector("#taskDescription"),
    taskDueDate = document.querySelector("#taskDueDate"),
    json = { 
      taskTitle: title.value, 
      taskDescription: taskDescription.value, 
      taskDueDate: taskDueDate.value 
    },
    body = JSON.stringify(json)

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  })

  const todos = await response.json()
  renderTodos(todos)

  // Clear fields after submit
  title.value=""
  taskDescription.value=""
  taskDueDate.value=""
}

function renderTodos(todos) {
  const list = document.querySelector("#todo-table");

  list.innerHTML = ""; // Clear existing todos
  todos.forEach((todo, idx) => {
    const li = document.createElement("li")
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <strong>${todo.taskTitle}</strong> - ${todo.taskDescription} 
      <span style="color: var(--color-5);">Due: ${todo.taskDueDate}</span>
      <span style="color: var(--color-2);"> (${todo.daysLeft} days left)</span>
      <button class="delete-btn" data-idx="${idx}" title="Delete">
        <i class="fa fa-trash-o" style="font-size:24px;color:red"></i>
      </button>
    `
    li.onclick = function(e) {
      if (!e.target.classList.contains("delete-btn") && !e.target.classList.contains("fa-trash-o")) {
        toggleCompleted(idx, !todo.completed);
      }
    };
    list.appendChild(li)
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.onclick = async function(e) {
      e.stopPropagation();
      const idx = button.getAttribute("data-idx");
      const response = await fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idx })
      });
      const todos = await response.json();
      renderTodos(todos);
    };
  });
}

async function toggleCompleted(idx, completed) {
  const response = await fetch("/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idx, completed })
  });
  const todos = await response.json();
  renderTodos(todos);
}

async function fetchTodos() {
  const response = await fetch("/todos");
  const todos = await response.json();
  renderTodos(todos);
}

window.onload = function () {
  const form = document.querySelector(".todo-form");
  form.onsubmit = submit;
  fetchTodos();
}