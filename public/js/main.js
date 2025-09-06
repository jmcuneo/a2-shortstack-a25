// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  // const input = document.querySelector( "#yourname" ),
  //       json = { "yourname": input.value },
  //       body = JSON.stringify( json )

  const input = {
    todo: document.querySelector("#todo").value,
    creationDate: document.querySelector("#todo2").value,
    deadlineDate: document.querySelector("#todo3").value
  }

  const fillAllFields = document.querySelector("#formMessage");
  fillAllFields.innerText = "";

  if (!input.todo|| !input.creationDate || !input.deadlineDate) {
    fillAllFields.innerText = "⚠️ Please fill in all fields before submitting.";
    return; // stop submission
  }


  let data =[]

  const body = JSON.stringify(input)

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  }).then(async function (response) {
    data = await response.json();   // get updated array from server
  })

  updateTable(data);                     // call client-side function

  // Clear form fields
  document.querySelector("#todo").value = "";
  document.querySelector("#todo2").value = "";
  document.querySelector("#todo3").value = "";
}

// Function to update HTML table with server data
function updateTable(data) {
  const table = document.querySelector("#todoTable");

  // Clear existing rows except header
  table.innerHTML = `
    <tr>
      <th>To Do Item</th>
      <th>Creation Date</th>
      <th>Deadline Date</th>
      <th>Priority</th>
      <th>Action</th>
    </tr>
  `;
  //console.log(data)


  //Append rows
  data.forEach(item => {
    const todo = JSON.parse(item); // parse the JSON string into an object
    const row = table.insertRow();
    const d1 = new Date(todo.deadlineDate);
    const d2 = new Date(todo.creationDate);
    const diffTime = Math.abs(d1 - d2);
    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //console.log(`The dates are ${diffDays} day(s) apart.`);
    row.insertCell(0).innerText = todo.todo;
    row.insertCell(1).innerText = todo.creationDate;
    row.insertCell(2).innerText = todo.deadlineDate;
    const priorityCell = row.insertCell(3);
    if(todo.creationDate > todo.deadlineDate){
      priorityCell.innerText = "Overdue";
      priorityCell.className = "status-overdue";
    }else if(diffDays >= 6){
      priorityCell.innerText = "Low";
      priorityCell.className = "status-low";
    }else if(diffDays >= 3){
      priorityCell.innerText = "Medium";
      priorityCell.className = "status-medium";
    }else if(diffDays >= 1){
      priorityCell.innerText = "High";
      priorityCell.className = "status-high";
    }else if(diffDays === 0){
      priorityCell.innerText = "Urgent";
      priorityCell.className = "status-urgent";
    }

    // ✅ Add Delete button
    const actionCell = row.insertCell(4);
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "editButton";
    editBtn.onclick = function() {
      makeRowEditable(row, todo);
    };
    actionCell.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "deleteButton";
    deleteBtn.onclick = async function() {
      await deleteTodo(todo); // call delete function
    };
    actionCell.appendChild(deleteBtn);
  });
}
// Load existing table data when page is refreshed
async function loadTable() {
  let data;
  const response = await fetch( "/getTable", {
    method:"GET",
  }).then(async function (response) {
    data = await response.json();   // get updated array from server
  })
  updateTable(data);
}

async function deleteTodo(todo) {
  let data = [];

  const body = JSON.stringify(todo);

  try {
    const response = await fetch("/delete", {
      method: "DELETE", // or "DELETE" if your server supports it
      body
    });
    data = await response.json(); // updated array after deletion
  } catch (err) {
    console.error("Error deleting todo:", err);
    return;
  }

  updateTable(data); // refresh table
}

async function makeRowEditable(row, todo) {
  // Replace cells with editable inputs
  row.cells[0].innerHTML = `<input type="text" value="${todo.todo}">`;
  row.cells[1].innerHTML = `<input type="date" value="${todo.creationDate}">`;
  row.cells[2].innerHTML = `<input type="date" value="${todo.deadlineDate}">`;

  // Priority should be recalculated on save → leave blank for now
  row.cells[3].innerText = "";

  // Action buttons: Replace with Save + Cancel
  const actionCell = row.cells[4];
  actionCell.innerHTML = "";

  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save";
  saveBtn.className = "saveButton";
  saveBtn.onclick = async function() {
    const updated = {
      todo: row.cells[0].querySelector("input").value,
      creationDate: row.cells[1].querySelector("input").value,
      deadlineDate: row.cells[2].querySelector("input").value,
    };
    await updateTodo(todo, updated); // call server update
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.innerText = "Cancel";
  cancelBtn.className = "cancelButton";
  cancelBtn.onclick = function() {
    loadTable(); // reload data to restore row
  };

  actionCell.appendChild(saveBtn);
  actionCell.appendChild(cancelBtn);
}


async function updateTodo(todo, updated) {
  let data = [];

  // Send both original and updated todo objects
  const body = JSON.stringify({
    original: todo,
    updated: updated
  });

  try {
    const response = await fetch("/update", {
      method: "PUT",
      body
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    data = await response.json(); // updated array after update
  } catch (err) {
    console.error("Error updating todo:", err);
    return;
  }

  updateTable(data); // refresh table
}



window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
  loadTable();
}