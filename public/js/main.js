// FRONT-END (CLIENT) JAVASCRIPT HERE

// Allow function to run in background
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
  title.value = ""
  taskDescription.value = ""
  taskDueDate.value = ""
}

function renderTodos(todos) {
  const list = document.querySelector("#todo-table");
  list.innerHTML = "";
  todos.forEach((todo, idx) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");
    li.innerHTML = `
      <strong>${todo.taskTitle}</strong> - ${todo.taskDescription} 
      <span style="color: var(--color-5);">Due: ${todo.taskDueDate}</span>
      <span style="color: var(--color-2);"> (${todo.daysLeft} days left)</span>
      <button class="edit-btn" data-idx="${idx}" title="Edit">
        <i class="fa fa-pencil" style="font-size:20px;color:#0074D9"></i>
      </button>
      <button class="delete-btn" data-idx="${idx}" title="Delete">
        <i class="fa fa-trash-o" style="font-size:24px;color:red"></i>
      </button>
    `;
    li.onclick = function (e) {
      if (!e.target.classList.contains("delete-btn") && !e.target.classList.contains("fa-trash-o") && !e.target.classList.contains("edit-btn") && !e.target.classList.contains("fa-pencil")) {
        toggleCompleted(idx, !todo.completed);
      }
    };
    list.appendChild(li);
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.onclick = async function (e) {
      if (confirm("Are you sure you want to delete this task?")) {
        e.stopPropagation();
        const idx = button.getAttribute("data-idx");
        const response = await fetch("/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idx })
        });
        const todos = await response.json();
        renderTodos(todos);
      }
    };
  });

  document.querySelectorAll(".edit-btn").forEach(button => {
    button.onclick = function (e) {
      e.stopPropagation();
      const idx = button.getAttribute("data-idx");
      showEditPopup(todos[idx], idx);
    };
  });
}

// Create and show a popup for editing a todo
function showEditPopup(todo, idx) {
  // Remove old popup if any
  const oldPopup = document.getElementById("edit-popup");
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement("div");
  popup.id = "edit-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)"; // center horizontally and vertically
  popup.style.background = "#fff";
  popup.style.padding = "2rem";
  popup.style.borderRadius = "12px";
  popup.style.boxShadow = "0 4px 24px rgba(40,130,237,0.18)";
  popup.style.zIndex = 1000; // make sure appears above other elements

  popup.innerHTML = `
    <h3>Edit Todo</h3>
    <form id="edit-form">
      <label>Task Title:<br><input type="text" id="edit-taskTitle" value="${todo.taskTitle}" required></label><br><br>
      <label>Description:<br><input type="text" id="edit-taskDescription" value="${todo.taskDescription}" required></label><br><br>
      <label>Due Date:<br><input type="date" id="edit-taskDueDate" value="${todo.taskDueDate}" required></label><br><br>
      <button type="submit">Save</button>
      <button type="button" id="cancel-edit">Cancel</button>
    </form>
  `;
  document.body.appendChild(popup);

  document.getElementById("cancel-edit").onclick = function () {
    popup.remove();
  };

  document.getElementById("edit-form").onsubmit = async function (e) {
    e.preventDefault();
    const updated = {
      idx,
      taskTitle: document.getElementById("edit-taskTitle").value,
      taskDescription: document.getElementById("edit-taskDescription").value,
      taskDueDate: document.getElementById("edit-taskDueDate").value
    };
    const response = await fetch("/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    const todos = await response.json();
    renderTodos(todos);
    popup.remove();
  };
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
  const form = document.querySelector(".todo-form"); // allow for keyboard entry
  form.onsubmit = submit;
  fetchTodos();
}