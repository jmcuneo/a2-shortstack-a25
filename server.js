const http = require("http"),
      fs   = require("fs"),
      mime = require("mime"),//mime describes the type of file
      dir  = "public/",
      port = 3000;

// In-memory dataset for mood entries
const appdata = [
    { "date": "2025-08-31", "mood": "Happy", "energy": 8, "status": "High Spirits" }
];

// Create server
const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

// Handle GET requests
const handleGet = function(request, response) {
    if (request.url === "/") {
      sendFile(response, dir + "index.html");
    } else if (request.url === "/data") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(appdata));
    } else {
      sendFile(response, dir + request.url.slice(1));
    }
  };

// Handle POST requests
const handlePost = function(request, response) {
  if (request.url === "/data") {
    let dataString = "";

    request.on("data", chunk => { dataString += chunk; });

    request.on("end", () => {
      console.log("Raw POST body:", dataString);
      const newEntry = JSON.parse(dataString);

      // Derived field: numeric score
      const moodValues = { Happy: 2, Neutral: 1, Sad: 0 };
      const energyValues = { 1: 0, 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8 };
      newEntry.score = (moodValues[newEntry.mood] || 0) + (energyValues[newEntry.energy] || 0);

      //Derived field: interpretation category
      if (newEntry.mood === "Happy" && newEntry.energy >= 7) {
        newEntry.status = "High Spirits";
      } else if (newEntry.mood === "Sad" && newEntry.energy <= 3){
        newEntry.status = "Low Point";
      } else if (newEntry.energy >= 8) {
        newEntry.status = "Energized";
      } else if (newEntry.energy <= 3) {
        newEntry.status = "Tired";
      } else {
        newEntry.status = "Moderate";
      }

      console.log("New entry with status:", newEntry);
      appdata.push(newEntry);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(appdata));
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
};

// Handle DELETE requests
const handleDelete = function(request, response) {
  if (request.url.startsWith("/data/")) {
    const index = parseInt(request.url.split("/").pop(), 10);

    if (!isNaN(index) && index >= 0 && index < appdata.length) {
      appdata.splice(index, 1);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(appdata));
    } else {
      response.writeHead(400);
      response.end("Invalid index");
    }
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
};

// Serve static files
  const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

// Start server
server.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
