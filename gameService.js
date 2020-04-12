const Games = new require('./games');

module.exports = function(_msg, send, broadcast){
    const msg = JSON.parse(_msg);
    const event = msg.event;
    const data = msg.data;
    let games;
    let game;
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
            send(`Hello, you sent -> ${_msg}`);
            break;
    }
}