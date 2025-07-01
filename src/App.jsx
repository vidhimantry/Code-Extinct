import { useState, useEffect } from "react"
import { clsx } from "clsx"
import { languages } from "../languages"
import { getFarewellText, getRandomWord } from "../utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(() => {
        const stored = localStorage.getItem("maxStreak")
        return stored ? Number(stored) : 0
    })

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const numGuessesLeft = languages.length 
    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const remainingGuesses = numGuessesLeft - wrongGuessCount
    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  useEffect(() => {
        if (isGameWon) {
            setCurrentStreak(prev => {
                const newStreak = prev + 1
                setMaxStreak(max => {
                    if (newStreak > max) {
                        localStorage.setItem("maxStreak", newStreak)
                        return newStreak
                    }
                    return max
                })
                return newStreak
            })
        } else if (isGameLost && isGameOver) {
            setCurrentStreak(0)
        }
    }, [isGameOver])

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const className = clsx({
            correct: isGuessed && currentWord.includes(letter),
            wrong: isGuessed && !currentWord.includes(letter)
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}>
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message"> {getFarewellText(languages[wrongGuessCount - 1].name)} </p>
            )
        }
        else if (isGameWon || isGameLost) {
            return (
                <>
                    <h2>{isGameWon ? "Nailed It!" : "Game over!" }</h2>
                    <p>{isGameWon ? "You cracked the code just in time!" : "You lose, Better luck next time!" }</p>
                </>
            )
        }
        else return <p></p>
    }

    return (
        <>
            <main>
                { isGameWon && 
                    <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight}
                    numberOfPieces={800} />}
                <header>
                    <h1>Code Extinct Game</h1>
                    <p>Guess the word within 8 attempts to save these
                    programming languages from getting extinct!</p>
                </header>

                <div className="streaks">
                    <span>Current Streak: <strong>{currentStreak}</strong></span>
                    <span>Max Streak: <strong>{maxStreak}</strong></span>
                </div>

                <section
                    aria-live="polite"
                    role="status"
                    className={gameStatusClass}
                >
                    {renderGameStatus()}
                </section>

                {!isGameWon && !isGameLost && <p className ="guesses-left">{remainingGuesses== languageElements.length ?
                "Total Guesses: " : "Remaining guesses: "}
                    <strong>{remainingGuesses}</strong> </p>}

                <section className="language-chips">
                    {languageElements}
                </section>

                <section className="word">
                    {letterElements}
                </section>

                {/* Combined visually-hidden aria-live region for status updates */}
                <section
                    className="sr-only"
                    aria-live="polite"
                    role="status">
                    <p>
                        {currentWord.includes(lastGuessedLetter) ?
                            `Correct! Letter ${lastGuessedLetter} is in the word.` :
                            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                        }
                        You have {numGuessesLeft} attempts left.
                    </p>
                    <p>Current word: {currentWord.split("").map(letter =>
                        guessedLetters.includes(letter) ? letter + "." : "blank.")
                        .join(" ")}</p>
                </section>

                <section className="keyboard">
                    {keyboardElements}
                </section>

                {isGameOver &&
                    <button
                        className="new-game"
                        onClick={startNewGame}
                    >New Game</button>}
    
            </main>
            <footer className="footer-signature">
                Created with <span className="footer-heart" aria-label="love" role="img">❤️</span> by Vidhi Mantry
            </footer>
        </>
    )
}
