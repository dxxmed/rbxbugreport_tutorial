import http from "http";
import { resourceLimits } from "worker_threads";

const PORT = 5000;

const Server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end("Hello world!");
});

Server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}!`);
});