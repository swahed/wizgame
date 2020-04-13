const assert = require('assert');
const Games = new require('../games');
const Game = new require('../game');

describe('games', function () {

    it('should be defined', function () {
        assert.notEqual(Games, undefined);
    });

    it('should be necessary to give a name when logining', function () {
        assert.throws(
            () => {
                new Games();
            },
            { message: "Cannot login without a name." }
        );
        assert.throws(
            () => {
                new Games("");
            },
            { message: "Cannot login without a name." }
        );
    });

    it('should be possible to login the game server as a new player', function () {
        assert.doesNotThrow(
            () => {
                new Games('Joe Exotic');
            }
        );
    });
});

describe('games', function () {
    let games = new Games('Joe Exotic');

    afterEach(function(){
        games._clearCache();
    });

    it('should be possible to create a game', function () {
        const game = games.join();
        assert.notEqual(game, undefined);
    });

    it('should be possible to retrieve a game id', function () {
        const game = games.join();
        const id = games.getGameId(game);
        assert(!isNaN(id));
    });

    it('should not be possible to join more then one game at a time', function () {
        games.join();
        assert.throws(
            () => {
                games.join();
            },
            { message: "Cannot join game, since already in game." }
        );
    });

    it('should be possible retrieve a unique game id', function () {
        const game1 = games.join();
        const id1 = games.getGameId(game1);
        const games2 = new Games('John Doe')
        const game2 = games2.join();
        const id2 = games.getGameId(game2);
        assert.notEqual(id1, id2);
    });
    
    it('should be possible join an existing game', function () {
        const game1 = games.join();
        const id1 = games.getGameId(game1);
        const games2 = new Games('John Doe')
        const game2 = games2.join(id1);
        assert.equal(game1, game2);
    });

    it('should bgive a list of existing games', function () {
        games.join();
        const games2 = new Games('John Doe')
        games2.join();

        const list = games.getList();
        assert(Array.isArray(list));
        assert.equal(list.length, 2);
        assert(list[0] instanceof Game)
    });
});