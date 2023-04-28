import { useState, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  // const words = [
  //   "analogy",
  //   "bureaucrat",
  //   "catastrophe",
  //   "demonstration",
  //   "enthusiasm",
  //   "zebra",
  // ];
  const [word, setWord] = useState("apple");
  const [guesses, setGuesses] = useState("");
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [holdGuesses, setHoldGuesses] = useState([]);
  const [difficulty, setDifficulty] = useState(5);
  useEffect(() => {
    getRandomWord();
  }, [difficulty]);
  const getRandomWord = () => {
    fetch(`https://random-word-api.herokuapp.com/word?length=${difficulty}`)
      .then((res) => res.json())
      .then((data) => {
        setWord(data[0]);
      });
  };
  const handleGuess = useCallback(() => {
    if (guesses.length === 0) return;
    if (!word.includes(guesses)) {
      setWrongGuesses((wrongGuesses) => wrongGuesses + 1);
      setHoldGuesses((correctGuesses) => [...correctGuesses, guesses]);
    } else {
      setHoldGuesses((correctGuesses) => [...correctGuesses, guesses]);
    }
    setGuesses("");
  }, [guesses, word]);

  const resetGame = useCallback(() => {
    getRandomWord();
    setGuesses("");
    setHoldGuesses([]);
    setWrongGuesses(0);
  }, []);

  const hiddenWord = word.replace(/\w/g, (letter, index) =>
    holdGuesses.includes(letter) || index % 3 === 0 ? letter : "_ "
  );
  const isWinner = !hiddenWord.includes("_");

  const isLoser = wrongGuesses >= 6;

  return (
    <div>
      <h1>Hangman</h1>
      <button onClick={() => setDifficulty(5)}>Easy</button>
      <button onClick={() => setDifficulty(7)}>Intermediate</button>
      <button onClick={() => setDifficulty(10)}>Hard</button>
      <button className="secondary" onClick={() => getRandomWord()}>
        New Word
      </button>
      <div>
        {isWinner && "You win!"}
        {isLoser && "You lose!"}
        {!isWinner && !isLoser && (
          <div>
            <p
              style={{
                fontSize: "30px",
                borderRadius: "10px",
                border: `solid ${
                  isWinner ? "green" : isLoser ? "red" : "gray"
                }`,
              }}
            >
              {hiddenWord} <br />
            </p>
            Guesses: {holdGuesses.join(",")} <br />
            Wrong guesses: {wrongGuesses}
          </div>
        )}
      </div>
      <div>
        {isWinner || isLoser ? (
          <button onClick={resetGame}>Play again</button>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter letter"
              value={guesses}
              onChange={(e) => setGuesses(e.target.value)}
              maxLength={1}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGuess();
                }
              }}
            />

            <button className="submit" onClick={() => handleGuess()}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
