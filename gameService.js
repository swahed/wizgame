const Games = new require('./games');

class GameService {
    _games;
    _game;
    constructor(socket) { // <-- TODO: Inject socket.io server, register listener once and create/destroy games class upon connection
        const _this = this;

        socket.on("join server", function (data) {
            let playerName = data && data.hasOwnProperty('name') ? data.name : null;
            _this._games = new Games(playerName);
            socket.emit('connected to server');
        });

        socket.on("list games", function (data, fn) {
            // if(!_this._games) throw
            socket.emit('games list updated', { 
                games: _this._games.getList() 
            });
        });

        socket.on("join game", function (data) {
            const gameId = data && data.hasOwnProperty('id') ? data.id : null;
            if(gameId) _this._game = _this._games.join(gameId);
            else _this._game = _this._games.join();
            socket.emit('joined game', { 
                gameId: _this._games.getGameId(_this._game) 
            });
            // TODO: socket.join(room[, callback])
            // TODO: io.to('room 237').emit('player joined', { playerId: playerId });
        });

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