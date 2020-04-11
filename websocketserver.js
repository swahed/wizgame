const ws = require('ws');

module.exports = function (server) {
    const wss = new ws.Server({ server });
    wss.on('connection', (ws) => {
        ws.on('message', (_msg) => {
            const msg = JSON.parse(_msg);
            const event = msg.event;
            const data = msg.data;
            function send(event, data) {
                ws.send(JSON.stringify({ event: event, data: data }));
            }
            function broadcast(event, data) {
                //TODO
                ws.send(JSON.stringify({ event: event, data: data }));
            }
            switch (event) {
                case "join server":
                    const playerId = data && data.hasOwnProperty('id') ? data.id : 4711;
                    send('join server success', { playerId: playerId });
                    break;
                case "list games":
                    const list = ["a", "b", "c"];
                    send('games list', { games: list });
                    break;
                case "join game":
                    const gameId = data && data.hasOwnProperty('id') ? data.id : 4711;
                    send('join game success', { gameId: gameId });
                    broadcast('player joined', { playerId: playerId });
                    break;
                case "start game":
                    send('game start success');
                    // all started -> broadcast('game started');
                    // send('your bid turn');
                    break;
                case "place bid":
                    const playerId2 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
                    const bid = data && data.hasOwnProperty('bid') ? data.id : 0;
                    send('bid place success');
                    broadcast('player bid', { playerId: playerId2, bid: bid });
                    // individual -> send('draw cards', { deck : []});
                    // send('your bid turn');
                    // all bid -> broadcast('all bids places');
                    // send('your play turn', { serveColor: null});
                    break;
                case "play card":
                    const card = data && data.hasOwnProperty('card') ? data.card : null;
                    send('bid place success');
                    // send('your turn', { serveColor: 'red'});
                    // send('cannot play', { reason: 'illegal'});
                    // broadcast('round finished', { scores: [] });
                    // individual -> send('draw cards', { deck : []});
                    // broadcast('game finished', { winner: 4711 });
                    break;
                default:
                    ws.send(`Hello, you sent -> ${_msg}`);
                    break;
            }

            console.log('received: %s', _msg);
        });
        ws.send('Connected');
    });

    return wss;
}