import './App.css';
import Board from './Board.jsx';
import Square from './Square.jsx';
import { useState, useEffect } from 'react';

const square = () => (new Array(9)).fill(null);

// Explain to the computer how the game works
// Explain so the computer can win
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8
const line = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function App() {

  const [squares, setSquares] = useState(square());
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    // Lines that are align for the WIN
    // Lines will change all the time until they sastisfy the const line=[] ON TOP of App.jsx
    const linesThatAre = (a, b, c) => {
      return line.filter(squareIndexes => {
        // return a copy + upgraded array
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
      });
    };

    // console.log('Computer play!');
    // alert('Computer play!');
    const emptyIndexes = squares.map((square, index) => square === null ? index : null)
    .filter(val => val !== null);

    // boolean value
    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    if(playerWon){
      // alert('Player won!');
      setWinner('x');
      return;
    }
    if(computerWon){
      // alert('Computer won!');
      setWinner('o');
      return;
    }

    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };

    if(isComputerTurn){
      // Computer will prioritize which ever function in 3 below came firt
      // 1. when 2 'o' => computer take the W
      // 2. when player is winning => computer block
      // 3. when player is playing around not for the win, computer go for the W


      // help the computer win when 2 'o' has been aligned
      const winningLines = linesThatAre('o', 'o', null);
      if(winningLines.length > 0){
        // find the null square so Computer can win
        const winIndex = winningLines[0].filter(index => squares[index] === null)[0];
        putComputerAt(winIndex);
        return;
      }

      // Teaching computer to block player before they got to 3 'x'
      const linesToBlockPlayer = linesThatAre('x', 'x', null);
      if(linesToBlockPlayer.length > 0){
        const blockPlayerAtIndex = linesToBlockPlayer[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockPlayerAtIndex);
        return;
      }
      
      // Help the computer to aim for the 3 'o' as 1st priority
      const computerMakingTheLineWhenPlayerIsNotFocus = linesThatAre('o', null, null)
      if(computerMakingTheLineWhenPlayerIsNotFocus.length > 0){
         const ToTheWinIndex = computerMakingTheLineWhenPlayerIsNotFocus[0]
         .filter(index => squares[index] === null)[0];
         putComputerAt(ToTheWinIndex);
         return;
      }

      const randomIndex = emptyIndexes[Math.ceil(Math.random()*emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares]);

  function handleSquareClick(index) {
    // count how many square is filled. to help us go in odd or even number
    // we go when even
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    // console.log(isPlayerTurn);
    // player go 
    // STOP PLAYER FROM CLICKING AND CHANGING MOVES OF COMPUTER
    // 30 MINS TO FIND the solution - HELLLLL YEAHHHHHH, finally
    if(isPlayerTurn && squares[index] === null && winner === null){
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  };

  return (
    <>
      <main>
        <header>Tic-tac-toe</header>
        <Board>
          {squares.map( (square, index) => 
            <Square
            x={square === 'x'? 1 : 0}
            o={square === 'o'? 1 : 0}
             onClick={() => handleSquareClick(index)}/>
          )}
        </Board>
        {!!winner && winner === 'x' && (
          <div className="result green">
            Player won!🤩
          </div>
         )}
        {!!winner && winner === 'o' && (
          <div className="result red">
            Computer won!😭
          </div>
        )}
        <button type='button' onClick={() => window.location.reload()}>
            Replay
        </button>
      </main>
    </>
  )
}

export default App
