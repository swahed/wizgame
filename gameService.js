const Games = new require('./games');

class GameService {
    _games;
    _game;
    constructor(socket) {
        const _this = this;
        socket.on("join server", function (data) {
            let playerName = data && data.hasOwnProperty('name') ? data.name : null;
            _this._games = new Games(playerName);
            socket.emit('join server success');
        });

        // socket.on("list games", function (data) {
        //     socket.emit('games list', { games: new Games("John Doe").getList() });
        // });

        // socket.on("join game", function (data) {
        //     socket.join(room[, callback])
        //     const gameId = data && data.hasOwnProperty('id') ? data.id : null;
        //     game = games.join(gameId);
        //     socket.emit('join game success', { gameId: games.getGameId(game) });
        //     broadcast('player joined', { playerId: playerId });
        //          io.to('room 237').emit('a new user has joined the room');
        // });

        // socket.on("start game", function (data) {
        //     game.start();
        //     socket.emit('start game success');
        //     // all started -> broadcast('game started');
        //     // socket.emit('your bid turn');
        // });

        // socket.on("place bid", function (data) {
        //     const playerId2 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
        //     const bid = data && data.hasOwnProperty('bid') ? data.id : 0;
        //     game.bid(playerId2, bid);
        //     socket.emit('place bid success');
        //     // broadcast('player bid', { playerId: playerId2, bid: bid });
        //     // individual -> socket.emit('draw cards', { deck : []});
        //     socket.to(id).emit('your bif turn', msg);
        //     // all bid -> broadcast('all bids places');
        //     // socket.emit('your play turn', { serveColor: null });
        // });

        // socket.on("play card", function (data) {
        //     const playerId3 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
        //     const card = data && data.hasOwnProperty('card') ? data.card : null;
        //     game.playCard(playerId3, card)
        //     socket.emit('play card success');
        //     // socket.emit('your turn', { serveColor: 'red'});
        //     // socket.emit('cannot play', { reason: 'illegal'});
        //     // broadcast('round finished', { scores: [] });
        //     // individual -> socket.emit('draw cards', { deck : []});
        //     // broadcast('game finished', { winner: 4711 });
        // });

        // TODDO:: Error unknown message
    }
}

module.exports = GameService;