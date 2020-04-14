const assert = require('assert');
const GameService = new require('../gameservice');

const EventEmitter = require('events');

class MockGame {
    _bidderId;
    _bid;
    _started = false;
    _playCardId;
    _card;
    start(){ this._started = true}
    bid(id, bid) {this._bidderId = id; this._bid = bid}
    playCard(id, card) {this._playCardId = id; this._card = card}
}
class MockGames {
    _id;
    _name;
    _game;
    constructor(name) {this._name = name}
    join(id) { this._id = id; return new MockGame()}
    getGameId(_g) { return 4711; }
    getList() { return [1,2,3] }
}

describe('gamesservice', function () {
    let testEmitter;

    function testIsEventAttached(testEvent, done) {
        testEmitter.on('newListener', (event, listener) => {
            if (event === testEvent) {
                assert(true);
                done();
            }
        });
        new GameService(testEmitter);
        assert(false);
    }

    beforeEach(function () {
        testEmitter = new EventEmitter();
    });

    it('should be defined', function () {
        assert.notEqual(GameService, undefined);
    });

    it('catch the "join server" event', function (done) {
        testIsEventAttached('join server', done);
    });

    it('should let a player join the game service', function (done) {
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.on('connected to server', () => {
            assert.equal(gs._games._name, "William Riker");
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    // TODO: Rejoin game as the same user after disconnect

    it('catch the "list games" event', function (done) {
        testIsEventAttached("list games", done);
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
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.on('connected to server', () => {
            testEmitter.emit('list games');
        });
        testEmitter.on('games list updated', (data) => {
            assert.deepEqual(data.games, [1,2,3]); // TODO: Add a couple of games, check length
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    it('catches the "join game" event', function (done) {
        testIsEventAttached("join game", done);
    });

    it('should be possible to create a new game', function (done) {
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.on('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.on('joined game', (data) => {
            assert(gs._game);
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    it('should be possible to join an existing game', function (done) {
        let gameId;
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.once('joined game', (data) => {
            gameId = data.gameId;
            testEmitter.emit('join server', { name: "Diana Troy" });
        });
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game', { id: gameId });
        });
        testEmitter.once('joined game', (data) => {
            assert(gs._game);
            assert.equal(gameId, data.gameId)
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    it('catches the "start game" event', function (done) {
        testIsEventAttached("start game", done);
    });

    it('should be possible to start a game', function (done) {
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.once('joined game', (data) => {
            gameId = data.gameId;
            testEmitter.emit('join server', { name: "Diana Troy" });
        });
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game', { id: gameId });
        });
        testEmitter.once('join game', (data) => {
            testEmitter.emit('start game', { id: gameId });
        });
        testEmitter.once('start game', (data) => {
            assert(gs._game._started);
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    it('catches the "place bid" event', function (done) {
        testIsEventAttached("place bid", done);
    });

    it('should be possible to place a bid', function (done) {
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.once('joined game', (data) => {
            gameId = data.gameId;
            testEmitter.emit('join server', { name: "Diana Troy" });
        });
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game', { id: gameId });
        });
        testEmitter.once('join game', (data) => {
            testEmitter.emit('start game', { id: gameId });
        });
        testEmitter.once('start game', (data) => {
            testEmitter.emit('place bid', { playerId: 12, bid: 100 });
        });
        testEmitter.once('place bid', (data) => {
            assert.equal(gs._game._bidderId, 12);
            assert.equal(gs._game._bid, 100);
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    it('catches the "play card" event', function (done) {
        testIsEventAttached("play card", done);
    });

    it('should be possible to play a card', function (done) {
        const gs = new GameService(testEmitter, MockGames);
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game');
        });
        testEmitter.once('joined game', (data) => {
            gameId = data.gameId;
            testEmitter.emit('join server', { name: "Diana Troy" });
        });
        testEmitter.once('connected to server', () => {
            testEmitter.emit('join game', { id: gameId });
        });
        testEmitter.once('join game', (data) => {
            testEmitter.emit('play card', { playerId: 42, card: "A13" });
        });
        testEmitter.once('play card', (data) => {
            assert.equal(gs._game._playCardId, 42);
            assert.equal(gs._game._card, "A13");
            done();
        });
        testEmitter.emit('join server', { name: "William Riker" });
    });

    
});
