const assert = require('assert');
const game = new require('../game').Game;

const helper = {
    emptyPlayersDecks: function (testGame) {
        testGame.state.decks = [[], [], [], []];
    }
}

describe('game setup', function () {
    let testGame;
    beforeEach(function () {
        testGame = new game();
    });

    it('should be defined', function () {
        assert.notEqual(game, undefined);
    });

    it('should be instatable', function () {
        assert.notEqual(testGame, undefined);
    });

    it('should know the 4 colors', function () {
        assert.deepEqual(testGame.colors.sort(), ["blue", "green", "red", "yellow"].sort());
    });

    it('should know the max value is 13', function () {
        for (let index = 0; index <= 13; index++) {
            assert.deepEqual(testGame.maxValue, 13);
        }
    });

    it('should have cards for each color and value', function () {
        const cards = [["blue", 1], ["blue", 2], ["blue", 3], ["blue", 4], ["blue", 5], ["blue", 6], ["blue", 7], ["blue", 8], ["blue", 9], ["blue", 10], ["blue", 11], ["blue", 12], ["blue", 13],
        ["red", 1], ["red", 2], ["red", 3], ["red", 4], ["red", 5], ["red", 6], ["red", 7], ["red", 8], ["red", 9], ["red", 10], ["red", 11], ["red", 12], ["red", 13],
        ["green", 1], ["green", 2], ["green", 3], ["green", 4], ["green", 5], ["green", 6], ["green", 7], ["green", 8], ["green", 9], ["green", 10], ["green", 11], ["green", 12], ["green", 13],
        ["yellow", 1], ["yellow", 2], ["yellow", 3], ["yellow", 4], ["yellow", 5], ["yellow", 6], ["yellow", 7], ["yellow", 8], ["yellow", 9], ["yellow", 10], ["yellow", 11], ["yellow", 12], ["yellow", 13]];

        assert.deepEqual(testGame.cards, cards);
    });

    it('should know have certain game phases', function () {
        assert.deepEqual(testGame.gamePhases, ["new", "deal", "bid", "play", "results", "complete"]);
    });

    it('should have the initial game phases of new', function () {
        assert.equal(testGame.state.phase, "new");
    });

    it('should allow multiple players to join', function () {
        testGame.addPlayer("John");
        assert.deepEqual(testGame.state.players, ["John"]);
        testGame.addPlayer("Maria");
        assert.deepEqual(testGame.state.players, ["John", "Maria"]);
        testGame.addPlayer("Bert");
        assert.deepEqual(testGame.state.players, ["John", "Maria", "Bert"]);
    });

    it('should start with round 1', function () {
        assert.equal(testGame.state.round, 1);
    });

    it('should allow for max no of rounds considering player no', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        assert.equal(testGame.state.maxRounds, 26);
        testGame.addPlayer("Bert");
        assert.equal(testGame.state.maxRounds, 17);
    });

    it('should have the initial game phase new', function () {
        assert.deepEqual(testGame.state.phase, "new");
    });

    it('should have the phase deal< after the game is started', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("Bert");
        testGame.start();
        assert.deepEqual(testGame.state.phase, "deal");
    });

    it('should accept new player in first stage', function () {
        assert.doesNotThrow(
            () => {
                testGame.addPlayer("John");
            }
        );
    });

    it('should not accept new player the other stages', function () {
        for (let i = 1; i < testGame.gamePhases.length; i++) {
            testGame.state.phase = testGame.gamePhases[i];

            assert.throws(
                () => {
                    testGame.addPlayer("John");
                },
                { message: "Cannot add new player." },
                `Phase '${testGame.state.phase}'`
            );
        }
    });

    it('should not allow to start < 3 players', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        assert.throws(
            () => {
                testGame.start();
            },
            { message: "Cannot start without minimum of 3 players." }
        );
    });

    it('should not allow to start >= 3 players', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("Bert");
        assert.doesNotThrow(
            () => {
                testGame.start();
            }
        );
    });

    it('should not allow to start > 6 players', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("John");
        assert.throws(
            () => {
                testGame.start();
            },
            { message: "Cannot start with more than 6 players." }
        );
    });

    it('should not allow to start after game has already been started', function () {
        testGame.addPlayer("John");
        testGame.addPlayer("Maria");
        testGame.addPlayer("John");
        testGame.start();
        assert.throws(
            () => {
                testGame.start();
            },
            { message: "Game is already in progress." }
        );
    });

    it('should enforce players to select a name', function () {
        assert.throws(
            () => {
                let id = testGame.addPlayer();
            },
            { message: "New Player cannot be added without a name." }
        );
    });

    it('should give new players an id', function () {
        let id = testGame.addPlayer("John");
        assert(id);
    });

    it('should give new players a unique id', function () {
        let id1 = testGame.addPlayer("John");
        let id2 = testGame.addPlayer("Maria");
        assert.notEqual(id1, id2);
    });

});

describe('starting and finishing a round in play', function () {
    let testGame;
    let playerId1;
    let playerId2;
    let playerId3;
    let playerId4;

    beforeEach(function () {
        testGame = new game();
        playerId1 = testGame.addPlayer("John");
        playerId2 = testGame.addPlayer("Maria");
        playerId3 = testGame.addPlayer("Bert");
        playerId4 = testGame.addPlayer("Ann");
        testGame.start();
    });

    it('should draw cards for each player', function () {
        assert.equal(testGame.state.decks.length, testGame.state.players.length);
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        assert.equal(testGame.state.decks.length, testGame.state.players.length);
    });

    it('should draw as many cards for each players as are available for the current round', function () {
        let cards = testGame.getCards(playerId1);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId2);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId3);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId4);
        assert.equal(testGame.state.round, cards.length);

        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        cards = testGame.getCards(playerId1);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId2);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId3);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId4);
        assert.equal(testGame.state.round, cards.length);

        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        cards = testGame.getCards(playerId1);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId2);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId3);
        assert.equal(testGame.state.round, cards.length);
        cards = testGame.getCards(playerId4);
        assert.equal(testGame.state.round, cards.length);
    });

    it('should draw different cards for each player', function () {
        let cards1 = testGame.getCards(playerId1);
        let cards2 = testGame.getCards(playerId2);
        let cards3 = testGame.getCards(playerId3);
        let cards4 = testGame.getCards(playerId4);
        assert.notDeepEqual(cards1, cards2);
        assert.notDeepEqual(cards2, cards3);
        assert.notDeepEqual(cards3, cards4);
    });

    it('should progress to next round when round is finished', function () {
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        assert.equal(testGame.state.round, 2);
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        assert.equal(testGame.state.round, 5);
    });

    it('should switch to state to complete after last round', function () {
        for (let i = 1; i < testGame.state.maxRounds; i++) {
            helper.emptyPlayersDecks(testGame);
            testGame.finishRound();
            assert.equal(testGame.state.phase, "deal");
        }
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        assert.equal(testGame.state.phase, "complete");
    });
});

// https://www.youtube.com/watch?v=VpaV4VVMGE4
describe('playing cards', function () {
    let testGame;
    let playerId1;
    let playerId2;
    let playerId3;
    let playerId4;

    beforeEach(function () {
        testGame = new game();
        playerId1 = testGame.addPlayer("John");
        playerId2 = testGame.addPlayer("Maria");
        playerId3 = testGame.addPlayer("Bert");
        playerId4 = testGame.addPlayer("Ann");
        testGame.start();
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        helper.emptyPlayersDecks(testGame);
        testGame.finishRound();
        testGame.state.decks = [
            [['red', 4], ['yellow', 4], ['green', 7]],
            [['red', 9], ['green', 2], ['blue', 8]],
            [['blue', 5], ['yellow', 3], ['green', 13]],
            [['red', 6], ['yellow', 13], ['green', 10]]
        ];
    });

    it('should be first players turn first', function () {
        assert.equal(testGame.state.playersTurn, playerId1);
    });

    it('should start a round with first trick', function () {
        assert.equal(testGame.state.tricks.length, 0);
    });

    it('should be possible for player 1 to play a card first', function () {
        assert.doesNotThrow(
            () => {
                let card = testGame.playCard(playerId1, 0);
                assert.deepEqual(card, ['red', 4]);
            }
        );
    });

    it('should only be possible to play a cards, which is are on the players hand.', function () {
        assert.throws(
            () => {
                testGame.playCard(playerId1, 4);
            },
            { message: "Wrong card selected. Available cards: 0 - 3." }
        );
        assert.throws(
            () => {
                testGame.playCard(playerId1, -1);
            },
            { message: "Wrong card selected. Available cards: 0 - 3." }
        );
    });

    it('should not be possible for player 2, 3, 4 to play a card first', function () {
        assert.throws(
            () => {
                testGame.playCard(playerId2, 0);
            },
            { message: "Wrong player, please wait for turn of player 1." }
        );
        assert.throws(
            () => {
                testGame.playCard(playerId3, 0);
            },
            { message: "Wrong player, please wait for turn of player 1." }
        );
        assert.throws(
            () => {
                testGame.playCard(playerId4, 0);
            },
            { message: "Wrong player, please wait for turn of player 1." }
        );
    });

    it('should be possible for player 2, 3, 4 to play card succinctly', function () {
        testGame.playCard(playerId1, 0);
        assert.doesNotThrow(
            () => {
                let card = testGame.playCard(playerId2, 0);
                assert.deepEqual(card, ['red', 9]);
            }
        );
        assert.doesNotThrow(
            () => {
                let card = testGame.playCard(playerId3, 0);
                assert.deepEqual(card, ['blue', 5]);
            }
        );
        assert.doesNotThrow(
            () => {
                let card = testGame.playCard(playerId4, 0);
                assert.deepEqual(card, ['red', 6]);
            }
        );
    });

    it('should be player 1 turn after player 4 if the game started with another player', function () {
        testGame.state.playersTurn = 2;
        testGame.playCard(playerId2, 0);
        testGame.playCard(playerId3, 0);
        testGame.playCard(playerId4, 0);
        assert.doesNotThrow(
            () => {
                let card = testGame.playCard(playerId1, 0);
            }
        );
    });

    it('should be possible to follow a card in another color, if one does not hava color on hand.', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        assert.doesNotThrow(
            () => {
                testGame.playCard(playerId3, 0); // ['blue', 5]
            }
        );
    });

    it('should start the second trick after all players have placed their cards', function () {
        testGame.playCard(playerId1, 0);
        testGame.playCard(playerId2, 0);
        testGame.playCard(playerId3, 0);
        testGame.playCard(playerId4, 0);
        assert.equal(testGame.state.tricks.length, 1);
        assert.equal(testGame.state.currentTrick.length, 0);
    });

    it('should declare the highest card in the trump color the winner of the trick', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 0); // ['blue', 5]
        testGame.playCard(playerId4, 0); // ['blue', 7]
        assert.equal(testGame.state.tricks[0], playerId2);
    });

    it('should be possible to follow a card in the same color', function () {
        let card1 = testGame.playCard(playerId1, 0); // ['red', 4]
        let card2;
        assert.doesNotThrow(
            () => {
                card2 = testGame.playCard(playerId2, 0); // ['red', 9]
            }
        );
        assert.equal(card1[0], card2[0]);
    });

    it('should not be possible to follow a card in another color, if one has color on hand.', function () {
        // First round
        testGame.playCard(playerId1, 0); // ['red', 4]
        assert.equal(testGame.state.playersTurn, 2);
        assert.throws(
            () => {
                card2 = testGame.playCard(playerId2, 1); // ['green', 2]
            },
            { message: "Wrong color, please play color red." }
        );
        assert.equal(testGame.state.playersTurn, 2);
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 1); // ['yellow', 3]
        testGame.playCard(playerId4, 0); // ['red', 6]
        // Second round
        testGame.playCard(playerId2, 0); // ['green', 2]
        assert.throws(
            () => {
                testGame.playCard(playerId3, 0); // ['blue', 5]
            },
            { message: "Wrong color, please play color green." }
        );
    });

    it('should remove a card from a players deck after it has been played', function () {
        let cards = testGame.getCards(playerId1);
        let card = testGame.playCard(playerId1, 0); // ['red', 4]
        assert.equal(cards.filter(c => c[0] === card[0] && c[1] === card[1]).length, 0);
    });

    it('should be the turn of the player first who won the previous trick', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 0); // ['blue', 5]
        testGame.playCard(playerId4, 0); // ['blue', 7]

        assert.throws(
            () => {
                testGame.playCard(playerId1, 0);
            },
            { message: "Wrong player, please wait for turn of player 2." }
        );
        assert.throws(
            () => {
                testGame.playCard(playerId3, 0);
            },
            { message: "Wrong player, please wait for turn of player 2." }
        );
        assert.throws(
            () => {
                testGame.playCard(playerId4, 0);
            },
            { message: "Wrong player, please wait for turn of player 2." }
        );
        assert.doesNotThrow(
            () => {
                testGame.playCard(playerId2, 0); // ['blue', 5]
            }
        );
    });

    it('should declare the highest card in the trump color the winner of the trick, if another player then player 1 startetd the trick.', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 1); // ['yellow', 3]
        testGame.playCard(playerId4, 0); // ['red', 6]

        testGame.playCard(playerId2, 0); // ['green', 2]
        testGame.playCard(playerId3, 1); // ['green', 13]
        testGame.playCard(playerId4, 1); // ['green', 10]
        testGame.playCard(playerId1, 1); // ['green', 7]
        assert.equal(testGame.state.tricks[1], playerId3);

        testGame.playCard(playerId3, 0); // ['blue', 5]
        testGame.playCard(playerId4, 0); // ['yellow', 14]
        testGame.playCard(playerId1, 0); // ['yellow', 4]
        testGame.playCard(playerId2, 0); // ['blue', 8]
        assert.equal(testGame.state.tricks[2], playerId2);
    });

    it('should be possible to finish a round once all the cards in the deck have been used up.', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 1); // ['yellow', 3]
        testGame.playCard(playerId4, 0); // ['red', 6]
        testGame.playCard(playerId2, 0); // ['green', 2]
        testGame.playCard(playerId3, 1); // ['green', 13]
        testGame.playCard(playerId4, 1); // ['green', 10]
        testGame.playCard(playerId1, 1); // ['green', 7]
        testGame.playCard(playerId3, 0); // ['blue', 5]
        testGame.playCard(playerId4, 0); // ['yellow', 14]
        testGame.playCard(playerId1, 0); // ['yellow', 4]
        testGame.playCard(playerId2, 0); // ['blue', 8]
        testGame.finishRound();
    });

    it('should not be possible to finish a round before all cards were plaed.', function () {
        testGame.playCard(playerId1, 0); // ['red', 4]
        testGame.playCard(playerId2, 0); // ['red', 9]
        testGame.playCard(playerId3, 1); // ['yellow', 3]
        testGame.playCard(playerId4, 0); // ['red', 6]
        testGame.playCard(playerId2, 0); // ['green', 2]
        assert.throws(
            () => {
                testGame.finishRound();
            },
            { message: "Cannot finish round while players still have cards in their decks." }
        );
    });

});


describe('Bidding and points', function () {

    beforeEach(function () {
        testGame = new game();
        playerId1 = testGame.addPlayer("Joan");
        playerId2 = testGame.addPlayer("Frank");
        playerId3 = testGame.addPlayer("Lynda");
        playerId4 = testGame.addPlayer("Phil");
        testGame.start();
        for (let i = 2; i <= 7; i++) {
            helper.emptyPlayersDecks(testGame);
            testGame.finishRound();        
        } // Trick 7
    });

    // testGame.state.tricks = ["Phil","Joan", "Joan",  "Phil", "Frank", "Joan"];

    it('should be possible for player 1 to make his bidding in the first round first.', function () {
        assert.doesNotThrow(
            () => {
                testGame.bid(playerId1, 3);
            }
        );
    });

    it('The minimum bid should be 0.', function () {
        assert.doesNotThrow(
            () => {
                testGame.bid(playerId1, 0);
            }
        );
        assert.throws(
            () => {
                testGame.bid(playerId1, -1);
            },
            { message: "Not able to bid. Should be a value between 0-7." }
        );
    });

    it('should not be possible to bit more than the max no of possible tricks.', function () {
        assert.throws(
            () => {
                testGame.bid(playerId1, 8);
            },
            { message: "Not able to bid. Should be a value between 0-7." }
        );
    });


    // it('should not be possible for player 2, 3, 4 to make their wager first', function () {
    //     assert.throws(
    //         () => {
    //             testGame.bid(playerId2, 1);
    //         },
    //         { message: "Wrong player, please wait for turn of player 1." }
    //     );
    //     assert.throws(
    //         () => {
    //             testGame.bid(playerId3, 1);
    //         },
    //         { message: "Wrong player, please wait for turn of player 1." }
    //     );
    //     assert.throws(
    //         () => {
    //             testGame.bid(playerId4, 1);
    //         },
    //         { message: "Wrong player, please wait for turn of player 1." }
    //     );
    // });

    // Only available payers

    // it('should be possible for each player to make a wager in turn.', function () {

    // });

    // it('should be possible for player 2, 3, 4, 1 to make his bidding first in the 2nd, 3rd, 4th, 5th round.', function () {

    // });

    // it('should be necessary for all player to make a wager before the first card can be played.', function () {

    // });
});

// TODO: Trumos
// TODO: Jesters and Wizards