const express = require('express');
const http = require('http');
const ws = require('ws');
const GameService = new require('./gameService');

const port = 4000;
const app = express();
const server = http.createServer(app);

const wss = new ws.Server({ server });
wss.on('connection', (ws) => {
    ws.on('message', (_msg) => {
        function send(event, data) {
            ws.send(JSON.stringify({ event: event, data: data }));
        }
        function broadcast(event, data) {
            //TODO
            ws.send(JSON.stringify({ event: event, data: data }));
        }
        GameService(_msg, send, broadcast);
        console.log('received: %s', _msg);
    });
    ws.send('Connected');
});

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

module.exports = server;