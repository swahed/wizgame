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
        testEventAttached('join server', done);
    });

    it('should let a player join the game service', function (done) {
        const gs = new GameService(testEmitter);
        testEmitter.on('connected to server', () => {
            assert.equal(gs._games._playerId, 0);
            done();
        });
        testEmitter.emit('join server', { name : "William Riker" });
    });

    // TODO: Rejoin game as the same user after disconnect

    it('catch the "list games" event', function (done) {
        testEventAttached("list games", done);
    });
    
    // TODO:
    // it('should throw an error if game list was requested before a connection was established', function (done) {
    //     const gs = new GameService(testEmitter);
    //     testEmitter.on('games list updated', (data) => {
    //         assert(Array.isArray(data)); // TODO: Add a couple of games, check length
    //         done();
    //     });
    //     testEmitter.emit('list games'); 
    // });

    it('should send the list of games if requested', function (done) {
        const gs = new GameService(testEmitter);
        testEmitter.on('connected to server', () => {
            testEmitter.emit('list games');
        });
        testEmitter.on('games list updated', (data) => {
            assert(Array.isArray(data.games)); // TODO: Add a couple of games, check length
            done();
        });
        testEmitter.emit('join server', { name : "William Riker" });
    });

    it('catch the "join game" event', function (done) {
        testEventAttached("join game", done);
    });

    it('should be possible to create a new game', function (done) {
        const gs = new GameService(testEmitter);
        testEmitter.on('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.on('joined game', (data) => {
            assert(gs._game);
            assert(!isNaN(data.gameId));
            done();
        });
        testEmitter.emit('join server', { name : "William Riker" });
    });

    it('should be possible to join an existing game', function (done) {
        let gameId;
        const gs = new GameService(testEmitter);
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.once('joined game', (data) => {
            gameId = data.gameId;
            testEmitter.emit('join server', { name : "Diana Troy" });
        });
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game', {id : gameId});
        });
        testEmitter.once('joined game', (data) => {
            assert.equal(gameId, data.gameId)
            done();
        });

        testEmitter.emit('join server', { name : "William Riker" });
    });





    function testEventAttached(testEvent ,done) {
        testEmitter.on('newListener', (event, listener) => {
            if (event === testEvent) {
                assert(true);
                done();
            }
        });
        new GameService(testEmitter);
        assert(false);
    }
});
