const assert = require('assert');
const GameService = new require('../gameservice');

const EventEmitter = require('events');

describe('gamesservice', function () {
    let testEmitter;
    beforeEach(function () {
        testEmitter = new EventEmitter();
    });

    it('should be defined', function () {
        assert.notEqual(GameService, undefined);
    });

    it('catch the "join server" event', function (done) {
        testEmitter.once('newListener', (event, listener) => {
            if (event === 'join server') {
                assert(true);
                done();
            }
        });
        new GameService(testEmitter);
        assert(false);
    });

    it('should let a player join the list of game', function (done) {
        const gs = new GameService(testEmitter);
        testEmitter.on('join server success', () => {
            assert.equal(gs._games._playerId, 0);
            done();
        });
        testEmitter.emit('join server', { name : "William Riker" });
    });

});