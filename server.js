const { createServer } = require("http");
const next = require("next");

const app = next({
  dev: true,
});

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler)
})