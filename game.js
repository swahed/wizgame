// https://www.youtube.com/watch?v=ThwR-8Tc83w
class Game {
    colors = ["blue", "red", "green", "yellow"];
    maxValue = 13;
    cards = [];
    gamePhases = ["new", "deal", "bid", "play", "results", "complete"];
    state = {
        phase: "new",
        players: [],
        decks: [],
        scores: [],
        round: 1,
        currentTrick : [],
        tricks: [],
        maxRounds: null,
        playersTurn : null,
        bidder : 1, // todo: Redundant to players turn
        bids : []
    }
    constructor() {
        for (const color of this.colors) {
            for (let index = 1; index <= this.maxValue; index++) {
                this.cards.push([color, index]);
            }
        }
    }
    _drawCards() {
        const cardStack = [...this.cards];
        this.state.decks = [];
        for (let i = 0; i <= this.state.players.length - 1; i++) {
            let deck = [];
            this.state.decks.push(deck);
            for (let j = 0; j < this.state.round; j++) {
                let random = Math.floor(Math.random() * cardStack.length);
                let card = cardStack[random];
                deck.push(card);
                cardStack.splice(random, 1);
            }
        }
    }
    start() {
        if (this.state.players.length < 3) throw new Error("Cannot start without minimum of 3 players.");
        if (this.state.players.length > 6) throw new Error("Cannot start with more than 6 players.");
        if (this.state.phase != this.gamePhases[0]) throw new Error( "Game is already in progress.");
        this.state.phase = this.gamePhases[1];
        this.state.playersTurn = 1;
        this._drawCards();
    }
    addPlayer(name) {
        if (this.state.phase != "new") throw new Error("Cannot add new player.");
        if (!name) throw new Error("New Player cannot be added without a name.");
        this.state.players.push(name);
        this.state.scores.push(0);
        this.state.maxRounds = ~~(this.cards.length / this.state.players.length);
        return this.state.players.length;
    }
    getCards(playerId) {
        // TODO: Check for existing player Id
        return this.state.decks[playerId - 1];
    } 
    getScore(playerId) {
        // TODO: Check for existing player Id
        return this.state.scores[playerId - 1];
    }
    bid(playerId, cardIndex){
        if(cardIndex < 0 || cardIndex > this.state.round) throw new Error(`Not able to bid. Should be a value between 0-${this.state.round}.`);
        if (playerId !== this.state.bidder) throw new Error(`Wrong player, please wait for turn of player ${this.state.bidder}.`);
        // next player
        if (++this.state.bidder > this.state.players.length){
            this.state.bidder = 1;
        }
        this.state.bids.push(cardIndex);
    }
    playCard(playerId, cardIndex){
        if(this.state.bids.length < this.state.players.length) throw new Error("All players need to place bids before cards can be played.");
        if (playerId !== this.state.playersTurn) throw new Error(`Wrong player, please wait for turn of player ${this.state.playersTurn}.`);
        if (cardIndex > this.state.decks[playerId -1].length || cardIndex < 0) throw new Error("Wrong card selected. Available cards: 0 - 3.");
        // play card
        let deck = this.state.decks[playerId -1];
        let card = deck[cardIndex];
        let cardColor = card[0];
        if(this.state.currentTrick.length > 0) {
            let firstColorInTrick = this.state.currentTrick[0][0];
            if (firstColorInTrick !== cardColor &&
                deck.filter(c => c[0] === firstColorInTrick).length > 0) {
                throw new Error(`Wrong color, please play color ${firstColorInTrick}.`);
            }
        }
        deck.splice(cardIndex, 1);
        this.state.currentTrick.push(card);
        // next player
        if (++this.state.playersTurn > this.state.players.length){
            this.state.playersTurn = 1;
        }
        // check for winner
        if (this.state.currentTrick.length >= this.state.players.length){
            let firstColorInTrick = this.state.currentTrick[0][0];
            var winnerCard = this.state.currentTrick.filter(c => c[0] === firstColorInTrick).reduce((prev, curr) => {
                if(!prev || curr[1] > prev[1]) return curr;
                else return prev;
            });
            let winningTrickIndex = this.state.currentTrick.indexOf(winnerCard);
            let winner = this.state.playersTurn + winningTrickIndex;
            if(winner > this.state.players.length) winner -= this.state.players.length;
            this.state.tricks.push(winner);
            this.state.currentTrick = [];
            this.state.playersTurn = winner;
        }
        return card;       
    }
    finishRound() {
        if(!this.state.decks.filter(d => !d.length).length) throw new Error("Cannot finish round while players still have cards in their decks.");
        if (this.state.round < this.state.maxRounds) {
            this.state.players.forEach((p, i) => {
                const tricks = this.state.tricks.filter(t => t === i + 1).length;
                const bids = this.state.bids[i];
                if(bids === tricks) {
                    this.state.scores[i] += 20;
                    this.state.scores[i] += tricks * 10;
                }else {
                    this.state.scores[i] -= Math.abs(bids - tricks) *10;
                } 
            });
            this.state.round++;
            if (++this.state.bidder > this.state.players.length){
                this.state.bidder = 1;
            }
            this.state.tricks = [];
            this.state.bids = [];
            this.state.playersTurn = this.state.bidder;
            this._drawCards();
        }
        else {
            this.state.phase = this.gamePhases[this.gamePhases.length - 1]
        };
    }
}

module.exports = Game; 