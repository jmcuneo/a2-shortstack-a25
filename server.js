const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define dataset for tasks
let tasks = [];
let nextId = 1;

// Function to calculate derived field [Baseline Req] (deadline based on priority and creation date)
function calculateDeadline(creation_date, priority) {
    const createDate = new Date(creation_date);
    let daysToAdd;
    
    switch(priority) {
        case 'high': daysToAdd = 3; break;
        case 'medium': daysToAdd = 7; break;
        case 'low': daysToAdd = 14; break;
        default: daysToAdd = 7;
    }
    
    createDate.setDate(createDate.getDate() + daysToAdd);
    return createDate.toISOString().split('T')[0];
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET' && pathname === '/') {
        serveFile('public/index.html', 'text/html', res);
    } else if (req.method === 'GET' && pathname === '/results') {
        serveFile('public/results.html', 'text/html', res);
    } else if (req.method === 'GET' && pathname === '/style.css') {
        serveFile('public/style.css', 'text/css', res);
    } else if (req.method === 'GET' && pathname === '/script.js') {
        serveFile('public/script.js', 'application/javascript', res);
    } else if (req.method === 'GET' && pathname === '/api/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } else if (req.method === 'POST' && pathname === '/api/tasks') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const data = JSON.parse(body);
            const newTask = {
                id: nextId++,
                task: data.task,
                priority: data.priority,
                creation_date: data.creation_date,
                deadline: calculateDeadline(data.creation_date, data.priority)
            };
            tasks.push(newTask);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTask));
        });
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/tasks/')) {
        const id = parseInt(pathname.split('/')[3]);
        tasks = tasks.filter(task => task.id !== id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
