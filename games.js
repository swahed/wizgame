const Game = new require('./game').Game;

let players = [];
let games = [];

class Games {
    _playerId;
    _gameId;
    _clearCache() {
        players = [];
        games = [];
        this._playerId = null;
        this._gameId = null;
    }
    constructor(name) {
        if (!name) throw new Error("Cannot login without a name.");
        const player = players.find(p => p === name);
        if (player) this._playerId = players.indexOf(player);
        else this._playerId = players.push(name);
        return this._player;
    }
    join(id) {
        if (this._gameId) throw new Error("Cannot join game, since already in game.");
        let game;
        if (isNaN(id)) game = new Game();
        else game = games[id];
        this._gameId = games.push(game);
        return game;
    }
    getGameId(_g) {
        const game = games.find(g => g === _g);
        if (game) return games.indexOf(game);
        else return null;
    }
    getList() {
        return [...games];
    }
}

module.exports = Games;