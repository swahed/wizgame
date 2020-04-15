class GameService {
    _games;
    _game;
    constructor(socket, Games = new require('./games')) { // <-- TODO: Inject socket.io server, register listener once and create/destroy games class upon connection
                                                          // <-- TODO: Implement proper dependency injection for GamesClass
        const _this = this;

        socket.on("join server", function (data) {
            let playerName = data && data.hasOwnProperty('name') ? data.name : null;
            _this._games = new Games(playerName);
            socket.emit('connected to server');
        });

        socket.on("list games", function (data, fn) {
            // TODO: if(!_this._games) throw
            socket.emit('games list updated', {
                games: _this._games.getList()
            });
        });

        socket.on("join game", function (data) {
            const gameId = data && data.hasOwnProperty('id') ? data.id : null;
            if (gameId) _this._game = _this._games.join(gameId);
            else _this._game = _this._games.join();
            socket.emit('joined game', {
                gameId: _this._games.getGameId(_this._game)
            });
            // TODO: socket.join(`game#${gameId}`)
            // TODO: socket.to(`game#${gameId}`).broadcast('player joined', { playerId: playerId });
        });

        socket.on("start game", function (data) {
            _this._game.start();
            // TODO: socket.emit('cannot start', { message: 'Still missing 2 players'});
            // TODO: socket.emit('start game request ok');
            socket.emit('game started'); // TODO: Replace with: as soon as everyone clicked start -> io.to(`game#${gameId}`).emit('game started');
            // TODO: socket.to(playermsgid).emit('your bid turn');
        });

        socket.on("place bid", function (data) {
            const playerId2 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
            const bid = data && data.hasOwnProperty('bid') ? data.bid : 0;
            _this._game.bid(playerId2, bid);
            // TODO: Necessary? socket.emit('place bid success');
            // TODO: socket.to(playermsgid).emit('your bid turn', msg);
            // TODO: io.to(`game#${gameId}`).emit('player bid', { playerId: playerId2, bid: bid });
            // TODO: Necessary? io.to(`game#${gameId}`).emit('all bids places');
            // TODO: socket.emit('draw cards', { deck : [...]});
            // TODO: socket.to(playermsgid).emit('your play turn', { serveColor: null });
        });

        socket.on("play card", function (data) {
            const playerId3 = data && data.hasOwnProperty('playerId') ? data.playerId : null;
            const card = data && data.hasOwnProperty('card') ? data.card : null;
            _this._game.playCard(playerId3, card)
            // TODO: Necessary? socket.emit('play card success');
            // TODO: socket.to(playermsgid).emit('your play turn', { serveColor: 'red'});
            // TODO: socket.emit('cannot play card', { reason: 'Needs to serve color yellow'});
            // TODO: io.to(`game#${gameId}`).emit('round finished', { scores: [] });
            // TODO: socket.emit('draw cards', { deck : []});
            // TODO: io.to(`game#${gameId}`).('game finished', { winner: 4711 });
        });

        // TODO: Catch all for to reply with Error for unknown message
        // TODO: Handle disconnect
    }
}

module.exports = GameService;
