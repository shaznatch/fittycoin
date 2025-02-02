window.onload = async function() {
    if (typeof supabase !== 'undefined') {
        const supabaseUrl = 'https://uebjtryhzkcrzqedskgp.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlYmp0cnloemtjcnpxZWRza2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzQzNzUsImV4cCI6MjA1MzY1MDM3NX0.c9op7rs-OadjZGY-PqyBEN9N0HfB8CBeaqPyxP3V7KY';
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const rankValues = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };

        let deck = [];
        let currentCard = null;
        let score = 0;

        function shuffleDeck() {
            deck = [];
            for (let suit of suits) {
                for (let rank of ranks) {
                    deck.push({ rank: rank, suit: suit, value: rankValues[rank] });
                }
            }
            deck = deck.sort(() => Math.random() - 0.5);
        }

        function drawCard() {
            return deck.pop();
        }

        function displayCard(card) {
            document.getElementById('card').textContent = `${card.rank} of ${card.suit}`;
        }

        function startGame() {
            shuffleDeck();
            currentCard = drawCard();
            score = 0;
            displayCard(currentCard);
            document.getElementById('game-message').textContent = '';
            document.getElementById('score-value').textContent = score;
            document.getElementById('higher').style.display = 'inline-block';
            document.getElementById('lower').style.display = 'inline-block';
            document.getElementById('restart').style.display = 'none';
            document.getElementById('wallet-prompt').style.display = 'none';
        }

        function guess(playerGuess) {
            if (deck.length === 0) {
                document.getElementById('game-message').textContent = "Game Over! No more cards left.";
                endGame();
                return;
            }

            let nextCard = drawCard();
            displayCard(nextCard);

            if (nextCard.value === currentCard.value) {
                document.getElementById('game-message').textContent = "Same rank! No points, try again!";
            } else if ((playerGuess === 'higher' && nextCard.value > currentCard.value) ||
                    (playerGuess === 'lower' && nextCard.value < currentCard.value)) {
                score++;
                document.getElementById('game-message').textContent = "Correct! Go again!";
            } else {
                document.getElementById('game-message').textContent = "Incorrect! Game over.";
                endGame();
                return;
            }

            currentCard = nextCard;
            document.getElementById('score-value').textContent = score;
        }

        function endGame() {
            document.getElementById('higher').style.display = 'none';
            document.getElementById('lower').style.display = 'none';
            document.getElementById('restart').style.display = 'inline-block';
            document.getElementById('wallet-prompt').style.display = 'block';
        }

        function isValidEthereumAddress(address) {
            return /^0x[a-fA-F0-9]{40}$/.test(address);
        }

        async function submitScore() {
            const walletInput = document.getElementById('wallet-input').value.trim();
            const errorMessage = document.getElementById('error-message');

            if (walletInput === "" || isValidEthereumAddress(walletInput)) {
                const playerName = walletInput === "" ? "Anon" : walletInput;

                const { data, error } = await supabaseClient
                    .from('scores')
                    .insert([{ name: playerName, score: score }]);

                if (error) {
                    console.error('Error submitting score:', error);
                } else {
                    fetchLeaderboard();
                }

                document.getElementById('wallet-prompt').style.display = 'none';
                document.getElementById('wallet-input').value = "";
                errorMessage.style.display = 'none';
            } else {
                errorMessage.style.display = 'block';
            }
        }

        async function cancelSubmission() {
            const { data, error } = await supabaseClient
                .from('scores')
                .insert([{ name: "Anon", score: score }]);

            if (error) {
                console.error('Error submitting score:', error);
            } else {
                fetchLeaderboard();
            }

            document.getElementById('wallet-prompt').style.display = 'none';
        }

        async function fetchLeaderboard() {
            const { data, error } = await supabaseClient
                .from('scores')
                .select('name, score')
                .order('score', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching leaderboard:', error);
                return;
            }

            const leaderboardElement = document.getElementById('leaderboard');
            leaderboardElement.innerHTML = "";

            data.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
                leaderboardElement.appendChild(listItem);
            });
        }

        // Expose functions globally so onclick works in HTML
        window.guess = guess;
        window.startGame = startGame;
        window.submitScore = submitScore;
        window.cancelSubmission = cancelSubmission;

        fetchLeaderboard();
        startGame();
    } else {
        console.error('Supabase library not loaded correctly!');
    }
};
