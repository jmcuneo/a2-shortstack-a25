const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000


//helper function to calculate the suggested deadline based on priority (Urgent: +1 day, High: +2 days, Medium: +7 days, Low: +30 days).
const calculateDeadline = function (startDate, priority) {
    const date = new Date(startDate);
    let daysToAdd = 0;
    switch (priority) {
        case "Urgent":
            daysToAdd = 1;
            break;
        case "High":
            daysToAdd = 2;
            break;
        case "Medium":
            daysToAdd = 7;
            break;
        case "Low":
            daysToAdd = 30;
            break;
    }
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

const initialCreationDate = new Date();

const appdata = [
    {
        "task": "Make To-Do List",
        "priority": "High",
        "dateCreated": new Date(),
        "suggestedDeadline": calculateDeadline(initialCreationDate, "High")
    },
];

const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response)
    } else if (request.method === "POST") {
        handlePost(request, response)
    }
})
const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else if (request.url === "/tasks") {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(appdata));
    } else {
        sendFile(response, filename);
    }
};

const handlePost = function (request, response) {
    let dataString = ""

    request.on("data", function (data) {
        dataString += data
    })

    request.on("end", function () {
        console.log(JSON.parse(dataString))

// derived field (date --> suggested deadline)
        const incomingData = JSON.parse(dataString);

        //check if its submit request
        if (request.url === "/submit") {
            console.log("Handling /submit request")

            //handle suggested deadline
            incomingData.dateCreated = new Date();
            incomingData.suggestedDeadline = calculateDeadline(incomingData.dateCreated, incomingData.priority);

            //add new task
            appdata.push(incomingData);
        } else if (request.url === "/delete") { //handle delete request
            console.log("Handling /delete request")
            const taskIndex = incomingData.index;
            //delete task
            if (taskIndex >= 0 && taskIndex <= appdata.length) {
                appdata.splice(taskIndex, 1);
            }
        } else if (request.url === "/update") { //handle update request
            console.log("Handling /update request")
            const taskIndex = incomingData.index;
            //update task
            if (taskIndex >= 0 && taskIndex < appdata.length) {
                const task = appdata[taskIndex];
                task.priority = incomingData.priority;
                // recalculate suggestedDeadline
                task.suggestedDeadline = calculateDeadline(task.dateCreated, task.priority);
            }
        }

        // success
        response.writeHead(200, "OK", {"Content-Type": "text/plain"});
        response.end("Task added successfully.");
    });
};

const sendFile = function (response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we"ve loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, {"Content-Type": type})
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end("404 Error: File Not Found")

        }
    })
}

server.listen(process.env.PORT || port)
