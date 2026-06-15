import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const port = 5173;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

createServer((request, response) => {
  const url = request.url?.split("?")[0] ?? "/";
  const path = url === "/" || url === "/pricing" || url === "/thank-you"
    ? "preview.html"
    : url.slice(1);

  try {
    const body = readFileSync(join(root, path));
    response.writeHead(200, {
      "Content-Type": mime[extname(path)] ?? "text/plain; charset=utf-8"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Local preview running at http://localhost:${port}`);
});
