const state = { tasks: [], lastSnapshot: [] };

async function api(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error((await res.json()).error || "Server error");
  return res.json();
}

async function fetchTasks() {
  try {
    state.tasks = await api("GET", "/api/tasks");
    renderTasks();
  } catch (err) {
    showError("Failed to load tasks: " + err.message);
  }
}

function renderTasks() {
  const tbody = document.getElementById("tasks-body");
  tbody.innerHTML = "";

  if (state.tasks.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="6" style="text-align:center;padding:2rem;">No tasks yet. Add your first task above!</td>';
    tbody.appendChild(tr);
    return;
  }

  state.tasks.forEach((t) => {
    const tr = document.createElement("tr");
    tr.classList.add(`priority-${t.priority}`);
    tr.innerHTML = `
      <td>${escapeHTML(t.title)}</td>
      <td><span class="priority-badge">${t.priority}</span></td>
      <td>${t.estimateHrs}</td>
      <td>${t.deadline || "No deadline"}</td>
      <td>${t.urgencyScore}</td>
      <td class="actions-cell">
        <button data-action="edit" data-id="${t.id}">Edit</button>
        <button data-action="delete" data-id="${t.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById("tasks-body").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === "delete") handleDelete(id);
  if (btn.dataset.action === "edit") enterEditMode(id);
});

function enterEditMode(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;
  document.getElementById("title").value = task.title;
  document.getElementById("priority").value = task.priority;
  document.getElementById("estimateHrs").value = task.estimateHrs;
  document.getElementById("deadline").value = task.deadline || "";
  document.getElementById("edit-id").value = task.id;
  document.getElementById("form-mode-label").textContent = "Edit Task";
  document.getElementById("submit-btn").textContent = "Save";
  document.getElementById("cancel-edit").classList.remove("hidden");

  // smooth scroll
  document.getElementById("entry-section").scrollIntoView({
    behavior: "smooth",
  });
}

document.getElementById("cancel-edit").addEventListener("click", resetForm);

function resetForm() {
  document.getElementById("task-form").reset();
  document.getElementById("edit-id").value = "";
  document.getElementById("form-mode-label").textContent = "Add Task";
  document.getElementById("submit-btn").textContent = "Add";
  document.getElementById("cancel-edit").classList.add("hidden");
}

document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: document.getElementById("title").value.trim(),
    priority: document.getElementById("priority").value,
    estimateHrs: Number(document.getElementById("estimateHrs").value),
    deadline: document.getElementById("deadline").value || null,
  };
  const editingId = document.getElementById("edit-id").value;
  state.lastSnapshot = JSON.parse(JSON.stringify(state.tasks));
  try {
    hideError();
    state.tasks = editingId
      ? await api("PUT", `/api/tasks/${editingId}`, data)
      : await api("POST", "/api/tasks", data);
    resetForm();
    renderTasks();
  } catch (err) {
    state.tasks = state.lastSnapshot;
    renderTasks();
    showError(err.message);
  }
});

async function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  state.lastSnapshot = JSON.parse(JSON.stringify(state.tasks));
  try {
    hideError();
    state.tasks = await api("DELETE", `/api/tasks/${id}`);
    renderTasks();
  } catch (err) {
    state.tasks = state.lastSnapshot;
    renderTasks();
    showError(err.message);
  }
}

function escapeHTML(str) {
  return str.replace(
    /[&<>"']/g,
    (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]),
  );
}

function showError(msg) {
  const container = document.getElementById("error-container");
  container.innerHTML = `<div class="error-banner">${escapeHTML(msg)}</div>`;
  container.scrollIntoView({ behavior: "smooth" });
}

function hideError() {
  document.getElementById("error-container").innerHTML = "";
}

// init app
fetchTasks();
