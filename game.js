// https://www.youtube.com/watch?v=ThwR-8Tc83w
exports.Game = class game {
    colors = ["blue", "red", "green", "yellow"];
    maxValue = 13;
    cards = [];
    gamePhases = ["new", "deal", "bid", "play", "results", "complete"];
    state = {
        phase: "new",
        players: [],
        decks: [],
        round: 1,
        currentTrick : [],
        tricks: [],
        maxRounds: null,
        playersTurn : null
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
        this.state.maxRounds = ~~(this.cards.length / this.state.players.length);
        return this.state.players.length;
    }
    getCards(playerId) {
        return this.state.decks[playerId - 1];
    }
    playCard(playerId, cardIndex){
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
        if (this.state.round < this.state.maxRounds) {
            this.state.round++;
            this._drawCards();
        }
        else {
            this.state.phase = this.gamePhases[this.gamePhases.length - 1]
        };
    }
}