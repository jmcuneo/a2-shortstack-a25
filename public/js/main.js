console.log("main.js loaded");

// Fetch and display existing data
async function loadTable() {
  const res = await fetch("/data");
  const data = await res.json();

  //Debug log (client side)
  console.log("Fetched data:", data);

  const tbody = document.querySelector("#moodTable tbody");
  tbody.innerHTML = ""; // clear old rows

  data.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.mood}</td>
      <td>${entry.energy}</td>
      <td>${entry.status || ""}</td>
      <td><button data-index="${index}" class="deleteBtn">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  // ✅ Hook up delete buttons after rendering
  setupDeleteButtons();
}

// Handle form submission
document.querySelector("#moodForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEntry = {
    date: document.querySelector("#date").value,
    mood: document.querySelector("#mood").value,
    energy: parseInt(document.querySelector("#energy").value),
  };

  await fetch("/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEntry),
  });

  loadTable(); // reload table
  e.target.reset(); // clear form
});

// ===== Custom Delete Confirmation Modal =====
let deleteIndex = null;

function setupDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteIndex = e.target.dataset.index;
      openModal();
    });
  });
}

// Modal elements
const modal = document.getElementById("confirmModal");
const yesBtn = document.getElementById("confirmYes");
const noBtn = document.getElementById("confirmNo");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

// Confirm delete
yesBtn.addEventListener("click", async () => {
  if (deleteIndex !== null) {
    console.log("Deleting entry at index:", deleteIndex);
    const res = await fetch(`/data/${deleteIndex}`, { method: "DELETE" });

    if (res.ok) {
      loadTable(); // refresh after delete
    } else {
      console.error("Failed to delete entry");
    }

    deleteIndex = null;
  }
  closeModal();
});

// Cancel delete
noBtn.addEventListener("click", () => {
  console.log("Delete cancelled");
  deleteIndex = null;
  closeModal();
});

// ===== Initial load =====
loadTable();
