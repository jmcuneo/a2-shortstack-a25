import process from "node:process"; // i usually use Deno as my linter & dev server
import { createServer } from "http";
import { readFile } from "fs";
import { join, dirname } from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

// ES modules dont having __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tasks = [];

function computeDerived(task) {
  const priorityWeight = { low: 1, medium: 2, high: 3, critical: 5 };

  // urgency score derived from priority & deadline
  if (task.deadline) {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const hoursUntilDeadline = Math.max(
      1,
      (deadlineDate - now) / (1000 * 60 * 60)
    );
    task.urgencyScore = Number(
      (priorityWeight[task.priority] / (hoursUntilDeadline / 24)).toFixed(2)
    );
  } else {
    // if no deadline: set an urgency score based on just priority
    task.urgencyScore = priorityWeight[task.priority];
  }

  return task;
}

function sendJSON(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function serveStatic(res, file, contentType) {
  const fp = join(__dirname, "public", file);
  readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function validate(data) {
  if (!data.title || typeof data.title !== "string") return "Title required";
  if (!["low", "medium", "high", "critical"].includes(data.priority)) {
    return "Invalid priority";
  }
  if (
    typeof data.estimateHrs !== "number" || data.estimateHrs <= 0 ||
    data.estimateHrs > 100
  ) return "Invalid estimate";

  // validate deadline
  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      return "Invalid deadline date";
    }
  }

  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // static files
  if (url.pathname === "/" && req.method === "GET") {
    return serveStatic(res, "index.html", "text/html; charset=UTF-8");
  }
  if (url.pathname === "/app.js") {
    return serveStatic(res, "app.js", "application/javascript");
  }
  if (url.pathname === "/styles.css") {
    return serveStatic(res, "styles.css", "text/css");
  }

  // API endpoints
  if (url.pathname === "/api/tasks" && req.method === "GET") {
    return sendJSON(res, 200, tasks);
  }

  if (url.pathname === "/api/tasks" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const errMsg = validate(body);
      if (errMsg) return sendJSON(res, 400, { error: errMsg });

      const task = {
        id: randomUUID(),
        title: body.title.trim(),
        priority: body.priority,
        estimateHrs: body.estimateHrs,
        deadline: body.deadline || null,
        createdAt: Date.now()
      };

      computeDerived(task);
      tasks.push(task);
      return sendJSON(res, 200, tasks);
    } catch (_e) {
      return sendJSON(res, 500, { error: "Bad JSON" });
    }
  }

  if (url.pathname.startsWith("/api/tasks/") && req.method === "PUT") {
    const id = url.pathname.split("/").pop();
    const task = tasks.find((t) => t.id === id);
    if (!task) return sendJSON(res, 404, { error: "Not found" });
    try {
      const body = await parseBody(req);
      if (body.title !== undefined) task.title = body.title.trim();
      if (body.priority !== undefined) task.priority = body.priority;
      if (body.estimateHrs !== undefined) task.estimateHrs = body.estimateHrs;
      if (body.deadline !== undefined) task.deadline = body.deadline || null;

      const errMsg = validate(task);
      if (errMsg) return sendJSON(res, 400, { error: errMsg });
      computeDerived(task);
      return sendJSON(res, 200, tasks);
    } catch (_e) {
      return sendJSON(res, 500, { error: "Bad JSON" });
    }
  }

  if (url.pathname.startsWith("/api/tasks/") && req.method === "DELETE") {
    const id = url.pathname.split("/").pop();
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    if (tasks.length === initialLength) {
      return sendJSON(res, 404, { error: "Not found" });
    }
    return sendJSON(res, 200, tasks);
  }

  res.writeHead(404);
  res.end("Not found");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server listening on", PORT));
