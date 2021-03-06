const Game = new require('../game');

const game = new Game();
const playerNames = ["Esther", "Troy", "Sabato", "Sander", "Heidi", "Tim"];
const players = [];
for (let names of playerNames) {
    const player = game.addPlayer(names);
    console.log(`Player ${names} joined the game.`);
    players.push(player);
}

game.start();

let round = 1;
while (round <= game.state.maxRounds) {
    // Drawing cards
    const cards = {};
    for (let player of players) {
        let temp = game.getCards(player).map(c => `${c[0]} ${c[1]}`)
        cards[player] = temp;
    }
    console.log(`Players drew the following cards:`)
    console.table(cards);

    // Playcing bids
    const bids = [];
    for (let i = 0; i < players.length; i++) {
        const bid = Math.floor(Math.random() * (round + 1));
        console.log(`Player ${game.state.bidder} bid ${bid}.`);
        game.bid(game.state.bidder, bid);
    }

    while (game.getCards(1).length) {
        console.log("Started Trick:");
        // Playing cards
        for (let i = 0; i < players.length; i++) {
            let valid = false;
            let player = game.state.playersTurn; // TODO: Should be public method card
            while (!valid) {
                try {
                    let deck = game.state.decks[player - 1];
                    let playing = Math.floor((Math.random() * deck.length));
                    let card = deck[playing];
                    game.playCard(player, playing); // TODO: Should return card
                    valid = true;
                    console.log(`Player ${player} plays ${card}.`);
                } catch (error) {
                    if (error.message.startsWith("Wrong color")) valid = false;
                    else throw error;
                }
            }
        }
    }


    console.log(`Finished round ${round++}:`);
    console.log(`Tricks: ${game.state.tricks}`);
    game.finishRound();

    const scores = [];
    for (let player of players) {
        const i = players.indexOf(player);
        console.log(`Player ${player} has ${game.getScore(i + 1)} points.`);
    }

}
