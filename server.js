const express = require('express');
const http = require('http');
const ws = require('ws');
const GameService = new require('./gameservice');

const port = 4000;
const app = express();

const server = app.listen(port, () => {
    console.log(`wiz-api server started on port ${port}`);
});

let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('someone connected');
    new GameService(socket);
});

module.exports = server;