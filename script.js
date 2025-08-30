async function fetchShifts() {
    const res = await fetch('/api/shifts');
    const data = await res.json();
    renderTable(data);
}

function renderTable(data) {
    const tbody = document.querySelector('#shiftTable tbody');
    tbody.innerHTML = '';

    let totalHours = 0, totalTips = 0;

    data.forEach(shift => {
        totalHours += shift.hours;
        totalTips += shift.tips;

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${shift.id}</td>
      <td>${shift.restaurant}</td>
      <td>${shift.hours}</td>
      <td>$${shift.tips.toFixed(2)}</td>
      <td>$${shift.rate.toFixed(2)}</td>
      <td>${shift.when}</td>
      <td>
        <button class="edit-btn" onclick="editShift(${shift.id})">Edit</button>
        <button class="delete-btn" onclick="deleteShift(${shift.id})">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    const avgRate = totalHours > 0 ? totalTips / totalHours : 0;
    document.getElementById('stats').textContent =
        `Total Hours: ${totalHours} | Total Tips: $${totalTips.toFixed(2)} | Average $/hr: $${avgRate.toFixed(2)}`;
}

document.getElementById('shiftForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('shiftId').value;
    const restaurant = document.getElementById('restaurant').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const tips = parseFloat(document.getElementById('tips').value);

    const payload = { restaurant, hours, tips };

    if (id) {
        // Edit shift
        await fetch(`/api/shifts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        // Add new shift
        await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    e.target.reset();
    document.getElementById('shiftId').value = '';
    fetchShifts();
});

async function deleteShift(id) {
    await fetch(`/api/shifts/${id}`, { method: 'DELETE' });
    fetchShifts();
}

function editShift(id) {
    fetch(`/api/shifts/${id}`)
        .then(res => res.json())
        .then(shift => {
            document.getElementById('shiftId').value = shift.id;
            document.getElementById('restaurant').value = shift.restaurant;
            document.getElementById('hours').value = shift.hours;
            document.getElementById('tips').value = shift.tips;
        });
}

fetchShifts();
