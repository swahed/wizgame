const ws = require('ws');
const Games = new require('./games');

module.exports = function (server) {
    const wss = new ws.Server({ server });
    wss.on('connection', (ws) => {
        let games;
        let game;
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
                    let playerName = data && data.hasOwnProperty('id') ? data.id : null;
                    games = new Games(playerName);
                    send('join server success');
                    break;
                case "list games":
                    send('games list', { games: new Games("John Doe").getList() });
                    break;
                case "join game":
                    const gameId = data && data.hasOwnProperty('id') ? data.id : null;
                    game = games.join(gameId);
                    send('join game success', { gameId: games.getGameId(game) });
                    // broadcast('player joined', { playerId: playerId });
                    break;
                case "start game":
                    game.start();
                    send('game start success');
                    // all started -> broadcast('game started');
                    // send('your bid turn');
                    break;
                case "place bid":
                    const playerId2 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
                    const bid = data && data.hasOwnProperty('bid') ? data.id : 0;
                    game.bid(playerId2, bid);
                    send('bid place success');
                    //broadcast('player bid', { playerId: playerId2, bid: bid });
                    // individual -> send('draw cards', { deck : []});
                    // send('your bid turn');
                    // all bid -> broadcast('all bids places');
                    // send('your play turn', { serveColor: null});
                    break;
                case "play card":
                    const playerId3 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
                    const card = data && data.hasOwnProperty('card') ? data.card : null;
                    game.playCard(playerId3, card)
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