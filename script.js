async function fetchShifts() {
    const res = await fetch('/results')
    const data = await res.json()
    renderTable(data)
}

async function addShift(e) {
    e.preventDefault()
    const restaurant = document.querySelector('#restaurant').value
    const hours = document.querySelector('#hours').value
    const tips = document.querySelector('#tips').value

    const res = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant, hours, tips })
    })

    const data = await res.json()
    renderTable(data)
}

async function deleteShift(id) {
    const res = await fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    const data = await res.json()
    renderTable(data)
}

function renderTable(shifts) {
    const tbody = document.querySelector('#shiftTableBody')
    tbody.innerHTML = ''

    let totalHours = 0
    let totalTips = 0

    shifts.forEach(s => {
        totalHours += s.hours
        totalTips += s.tips

        const tr = document.createElement('tr')
        tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.restaurant}</td>
      <td>${s.hours}</td>
      <td>$${s.tips.toFixed(2)}</td>
      <td>$${s.rate}</td>
      <td>${s.when}</td>
      <td><button onclick="deleteShift(${s.id})">Delete</button></td>
    `
        tbody.appendChild(tr)
    })

    const avg = totalHours > 0 ? (totalTips / totalHours).toFixed(2) : '0.00'

    document.querySelector('#totalHours').textContent = totalHours
    document.querySelector('#totalTips').textContent = `$${totalTips.toFixed(2)}`
    document.querySelector('#avgRate').textContent = `$${avg}`
}

document.querySelector('#shiftForm').addEventListener('submit', addShift)
fetchShifts()
