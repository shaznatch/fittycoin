// Define the deck and rank values
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const rankValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

let deck = [];
let currentCard = null;
let score = 0;

// Shuffle the deck
function shuffleDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank: rank, suit: suit, value: rankValues[rank] });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

// Draw a card
function drawCard() {
    return deck.pop();
}

// Display the current card
function displayCard(card) {
    const cardElement = document.getElementById('card');
    cardElement.textContent = `${card.rank} of ${card.suit}`;
}

// Start the game
function startGame() {
    shuffleDeck();
    currentCard = drawCard();
    score = 0;
    displayCard(currentCard);
    document.getElementById('game-message').textContent = '';
    document.getElementById('score-value').textContent = score;

    // Show the Higher and Lower buttons, hide the Restart button
    document.getElementById('higher').style.display = 'inline-block';
    document.getElementById('lower').style.display = 'inline-block';
    document.getElementById('restart').style.display = 'none';
}

// Guess function
function guess(playerGuess) {
    if (deck.length === 0) {
        document.getElementById('game-message').textContent = "Game Over! No more cards left.";
        return;
    }

    let nextCard = drawCard();
    displayCard(nextCard);

    if ((playerGuess === 'higher' && nextCard.value > currentCard.value) ||
        (playerGuess === 'lower' && nextCard.value < currentCard.value)) {
        score++;
        currentCard = nextCard;
        document.getElementById('game-message').textContent = "Correct! Go again!";
    } else {
        document.getElementById('game-message').textContent = "Incorrect! Game over.";
        endGame();
    }

    document.getElementById('score-value').textContent = score;
}

// End the game: Disable buttons and show Restart button
function endGame() {
    document.getElementById('higher').style.display = 'none';
    document.getElementById('lower').style.display = 'none';
    document.getElementById('restart').style.display = 'inline-block';
}

// Initialize the game
startGame();
