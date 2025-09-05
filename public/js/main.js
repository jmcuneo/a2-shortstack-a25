// FRONT-END (CLIENT) JAVASCRIPT HERE
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
        month: "long", day: "numeric", year: "numeric" 
    });
};

const deleteTask = async function (event) {
    event.preventDefault();

    if (event.target.classList.contains("delete-btn")) {
        const li = event.target.closest("li");
       
        const response = await fetch("/delete", {
            method: "DELETE",
            body: JSON.stringify({ id: Number(li.dataset.id) }),
        });

        const result = await response.json()
        if (result.success) {
            li.remove()
        }
    }
};

function showEditForm (li, task) {
    li.innerHTML = `
        <div id="edit-form">
            <input type="text" id="edit-title" class="title" value="${task.title}" placeholder="Title" />
            <input type="text" id="edit-description" class="description" value="${task.description}" placeholder="Description" />
            <input type="date" id="edit-due" class="dueDate" value="${task.dueDate}" />
            <button class="save-btn">Save</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
}

async function saveEdit (li) {
    const updatedTask = {
        id: Number(li.dataset.id),
        title: li.querySelector("#edit-title").value,
        description: li.querySelector("#edit-description").value,
        dueDate: li.querySelector("#edit-due").value
    }

    const response = await fetch("/edit", {
        method: "PUT",
        body: JSON.stringify(updatedTask),
    });

    const task = await response.json();

    li.innerHTML = `
        <span class="title-text">${task.title}</span>
        ${task.description ? `:
            ${task.description}` : ""}
        <div class="due-date">
            ${
                task.dueDate
                    ? `(Due ${formatDate(task.dueDate)}) 
                <span class="counter">Days Until Due: </span> ${
                    task.daysLeft
                }`
                    : ""
            }
        </div>
        <div class="btn-group">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
}

function cancelEdit (li, task) {
    li.innerHTML = `
        <span class="title-text">${task.title}</span>
        ${task.description ? `: ${task.description}` : ""}
        <div class="due-date">
            ${
                task.dueDate
                    ? `(Due ${formatDate(task.dueDate)}) 
                <span class="counter">Days Until Due: </span> ${
                    task.daysLeft
                }`
                    : ""
            }
        </div>
        <div class="btn-group">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
}

const editTask = async function (event) {
    event.preventDefault();
    const li = event.target.closest("li"),
        taskID = li.dataset.id;
    
    const response = await fetch(`/task/${taskID}`);
    const task = await response.json();

    if (event.target.classList.contains("edit-btn")) {
        showEditForm(li, task);
    } else if (event.target.classList.contains("save-btn")) {
        saveEdit(li);
    } else if (event.target.classList.contains("cancel-btn")) {
        cancelEdit(li, task);
    }
}


const submit = async function (event) {
    // stop form submission from trying to load a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();

    const title = document.querySelector(".title"),
        description = document.querySelector(".description"),
        dueDate = document.querySelector(".dueDate"),
        tasks = document.querySelector("#tasks"),
        json = {
            title: title.value,
            description: description.value,
            dueDate: dueDate.value,
        },
        body = JSON.stringify(json);

    // send to server through the /submit url and wait for response
    // can only use await in async function
    const response = await fetch("/add", {
        method: "POST",
        body
    });

    const task = await response.json()
    tasks.innerHTML += `
        <li data-id="${task.id}" class="list-item">
            <span class="title-text">${task.title}</span>
            ${task.description ? `:  ${task.description}` : ""}
            <div class="due-date">
                ${
                    task.dueDate
                        ? `(Due ${formatDate(task.dueDate)}) 
                    <span class="counter">Days Until Due: </span> ${
                        task.daysLeft
                    }`
                        : ""
                }
            </div>
            <div class="btn-group">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </li>
    `;

    // clear form fields
    title.value = "";
    description.value = "";
    dueDate.value = "";

    // const text = await response.text()
    // console.log( "text:", text)

    tasks.addEventListener("click", deleteTask)
    tasks.addEventListener("click", editTask)
};


// after the window is done loading, run this function
// window.onload is an event
window.onload = function () {
    const button = document.querySelector(".submit-btn");
    button.onclick = submit;
};
