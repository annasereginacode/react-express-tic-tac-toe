import { useState, useEffect } from 'react'


function Square({ value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}>{value}</button>
  );
}


function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice(); // copy of squares array
    nextSquares[i] = (xIsNext) ? "X" : "O";

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = squares.every(square => square !== null);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}


export default function Game() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]); // the history is an array of arrays; at the beginning in has only one array filled of null-s.
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // if the current move is even number, so the next turn is 'X' (so xIsNext is true)
  const currentSquares = history[currentMove];

  useEffect(() => {
    fetch('/data')
      .then(res => res.json())
      .then(data => {
        setHistory(data.history);
        setCurrentMove(data.currentMove);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log("Error message: ", err);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return; // the first data is not loaded yet
    }

    fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, currentMove })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Data from client sent. Got a response from server!");

      });
  }, [currentMove]); // save when currentMove changes (in the current game design currentMove changes every time when history changes and even more)

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // after jump to the "past", we cut the part of "history moves" that we don't need any more: ...history.slice(0, currentMove + 1)
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    let className;
    if (move === currentMove) {
      className = "currentMove";
    } else {
      className = "move";
    }

    return (
      <li key={move}>
        <button className={className} onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="page">
      <h1>Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <div><button className="reset-button" onClick={resetGame}>Reset</button></div>
        </div>
        <div className="game-info">
          <div className="status">Game turns</div>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
