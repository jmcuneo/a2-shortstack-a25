const http = require('http'),
    fs   = require('fs'),
    port = 3000;

let shifts = [];
let nextId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    sendFile(res, 'public/index.html');
  } else if (req.method === 'GET' && req.url === '/css/main.css') {
    sendFile(res, 'public/css/main.css', 'text/css');
  } else if (req.method === 'GET' && req.url === '/script.js') {
    sendFile(res, 'script.js', 'application/javascript');
  } else if (req.url.startsWith('/api/shifts')) {
    handleAPI(req, res);
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(process.env.PORT || port);

function sendFile(res, filename, contentType = 'text/html') {
  fs.readFile(filename, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

function handleAPI(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3] ? parseInt(urlParts[3]) : null;

  if (req.method === 'GET' && req.url === '/api/shifts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(shifts));
  } else if (req.method === 'GET' && id) {
    const shift = shifts.find(s => s.id === id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(shift));
  } else if (req.method === 'POST' && req.url === '/api/shifts') {
    collectRequestData(req, result => {
      const rate = result.tips / result.hours;
      const shift = { id: nextId++, ...result, rate, when: new Date().toLocaleString() };
      shifts.push(shift);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(shift));
    });
  } else if (req.method === 'PUT' && id) {
    collectRequestData(req, result => {
      const shift = shifts.find(s => s.id === id);
      if (shift) {
        shift.restaurant = result.restaurant;
        shift.hours = result.hours;
        shift.tips = result.tips;
        shift.rate = result.tips / result.hours;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(shift));
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
  } else if (req.method === 'DELETE' && id) {
    shifts = shifts.filter(s => s.id !== id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  }
}

function collectRequestData(req, callback) {
  let body = '';
  req.on('data', chunk => (body += chunk.toString()));
  req.on('end', () => callback(JSON.parse(body)));
}
