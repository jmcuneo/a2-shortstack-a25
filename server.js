const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3000

let shifts = [] // store all shift entries

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve static files
    switch (req.url) {
      case '/':
      case '/index.html':
        return sendFile(res, 'index.html', 'text/html')
      case '/style.css':
        return sendFile(res, 'style.css', 'text/css')
      case '/script.js':
        return sendFile(res, 'script.js', 'application/javascript')
      case '/results':
        // return JSON dataset
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(shifts))
        break
      default:
        res.writeHead(404)
        res.end('404 Error: File Not Found')
    }
  } else if (req.method === 'POST') {
    // Handle form submissions (adding new shifts)
    if (req.url === '/add') {
      let body = ''
      req.on('data', chunk => (body += chunk.toString()))
      req.on('end', () => {
        const data = JSON.parse(body)

        // compute derived field
        const hours = parseFloat(data.hours)
        const tips = parseFloat(data.tips)
        const rate = hours > 0 ? (tips / hours).toFixed(2) : '0.00'

        // build row with derived field + ID
        const newShift = {
          id: shifts.length + 1,
          restaurant: data.restaurant,
          hours,
          tips,
          rate,
          when: new Date().toLocaleString()
        }

        shifts.push(newShift)

        // return updated data
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(shifts))
      })
    } else if (req.url === '/delete') {
      let body = ''
      req.on('data', chunk => (body += chunk.toString()))
      req.on('end', () => {
        const { id } = JSON.parse(body)
        shifts = shifts.filter(s => s.id !== id)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(shifts))
      })
    }
  }
})

server.listen(port, () => console.log(`Server running on http://localhost:${port}`))

// Utility: serve static files
function sendFile(res, filename, type) {
  fs.readFile(filename, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Server Error')
    } else {
      res.writeHead(200, { 'Content-Type': type })
      res.end(content, 'utf-8')
    }
  })
}


