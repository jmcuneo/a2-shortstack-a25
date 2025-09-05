const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000;

const appdata = [];
let taskID = 1;


const server = http.createServer(function (request, response) {
    if (request.method === "GET" && request.url.startsWith("/task/")) {
        const id = request.url.split("/")[2];
        handleGetTask(request, response, id);
    } else if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "POST" && request.url === "/add") {
        handleAdd(request, response);
    } else if (request.method === "PUT" && request.url === "/edit") {
        handleEdit(request, response);
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    }
});

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else {
        sendFile(response, filename);
    }
};

const handleGetTask = function (request, response, id) {
    const task = appdata.find(t => t.id === Number(id))
    
    if (task) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(task));
    } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(
            JSON.stringify({ success: false, message: "Task not found" })
        );
    }
};

function calculateDaysDue(dueDateStr) {
    const today = new Date();
    const dueDate = new Date(dueDateStr);

    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue
}

const handleAdd = function (request, response) {
    let dataString = "";

    // as data packets come in, concatenate to string
    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const targetTask = JSON.parse(dataString);

        // calculate days until due
        const daysUntilDue = calculateDaysDue(targetTask.dueDate);
        if (daysUntilDue >= 0) {
            targetTask.daysLeft = daysUntilDue;
        } else {
            targetTask.daysLeft = "Overdue";
        }

        targetTask.id = taskID;

        // add to appdata
        appdata.push(targetTask);
        taskID++;

        response.writeHead(200, "OK", { "Content-Type": "text/plain" });
        response.end(JSON.stringify(targetTask));
    });
};


const handleEdit = function (request, response) {
    let dataString = "";

    // as data packets come in, concatenate to string
    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const updatedTask = JSON.parse(dataString);

        // find index of task in appdata array
        const taskIndex = appdata.findIndex(
            (task) => task.id === Number(updatedTask.id)
        );

        if (taskIndex !== -1) {
            // recalculate days until due
            const daysUntilDue = calculateDaysDue(updatedTask.dueDate);

            if (daysUntilDue >= 0) {
                updatedTask.daysLeft = daysUntilDue;
            } else {
                updatedTask.daysLeft = "Overdue";
            }

            appdata[taskIndex] = updatedTask;

            response.writeHead(200, "OK", { "Content-Type": "text/plain" });
            response.end(JSON.stringify(updatedTask));
        } else {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end(
                JSON.stringify({
                    success: false,
                    message: "404 Error: Task not found",
                })
            );
        }
    });
}


const handleDelete = function (request, response) {
    let dataString = "";

    // as data packets come in, concatenate to string
    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const targetTask = JSON.parse(dataString)
        // find index of task in appdata array
        const taskIndex = appdata.findIndex(task => task.id === Number(targetTask.id))
        
        if (taskIndex !== -1) {
            appdata.splice(taskIndex, 1)
            response.writeHead(200, "OK", { "Content-Type": "text/plain" });
            response.end(JSON.stringify({ success: true, message: "Task Removed" }));
        } else {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end(JSON.stringify({ success: false, message: "404 Error: Task not found"}));
        }
    });
};

const sendFile = function (response, filename) {
    const type = mime.getType(filename);

    fs.readFile(filename, function (err, content) {
        // if the error = null, then we"ve loaded the file successfully
        if (err === null) {
            // status code: https://httpstatuses.com
            response.writeHeader(200, { "Content-Type": type });
            response.end(content);
        } else {
            // file not found, error code 404
            response.writeHeader(404);
            response.end("404 Error: File Not Found");
        }
    });
};

server.listen(process.env.PORT || port);
