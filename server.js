const express = require('express');
const http = require('http');
const websocketserver = require('./websocketserver');

const port = 4000;
const app = express();

const server = http.createServer(app);
const wss = websocketserver(server);

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

module.exports = server;