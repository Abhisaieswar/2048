import "./App.css";
import { useEffect, useState,useRef } from "react";
import {
  generateInitialTiles,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  generateNewTile,
  isGameOver
} from "./helper/helper";
import Tile from "./components/Tile.js";

const App = () => {
  const [grid, setGrid] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const storedTiles=useRef([])
  const gameOver=useRef(false)

  const emptyGrid = Array(16).fill(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    storedTiles.current = JSON.parse(localStorage.getItem("2048-board")) || []
    gameOver.current=JSON.parse(localStorage.getItem("game-over"))
    if (storedTiles.current.length===0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      storedTiles.current = generateInitialTiles();

      localStorage.setItem("2048-board", JSON.stringify(storedTiles.current));
      localStorage.setItem("game-over",JSON.stringify(false))
    }
    setGrid(storedTiles.current);

    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener("resize", checkScreenWidth);

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const updateGrid=(newGrid)=>{
    storedTiles.current=newGrid;
    setGrid(newGrid);
  }

  const handleKey = (e) => {
    console.log(gameOver.current)
    if(gameOver.current)  return
    if (e.key === "ArrowUp") {
      const {newGrid,isSame}=moveUp(storedTiles.current);
      if(isSame) return
      updateGrid(newGrid)
    } else if (e.key === "ArrowDown") {
      const {newGrid,isSame}=moveDown(storedTiles.current);
      if(isSame) return
      updateGrid(newGrid)
    } else if (e.key === "ArrowLeft") {
      const {newGrid,isSame}=moveLeft(storedTiles.current);
      if(isSame) return
      updateGrid(newGrid)
    } else if (e.key === "ArrowRight") {
      const {newGrid,isSame}=moveRight(storedTiles.current);
      if(isSame) return
      updateGrid(newGrid)
    } else {
      return;
    }
    
    const { tile, row, col } = generateNewTile(storedTiles.current);
    storedTiles.current[row][col] = tile;
    localStorage.setItem("2048-board", JSON.stringify(storedTiles.current));
    setGrid(storedTiles.current);
    
    if(isGameOver(storedTiles.current)){
      gameOver.current=true
      localStorage.setItem("game-over",JSON.stringify(true))
    }
  };

  const startNewGame=()=>{
    storedTiles.current = generateInitialTiles();
    gameOver.current=false
    setGrid(storedTiles.current)
    localStorage.setItem("2048-board", JSON.stringify(storedTiles.current));
    localStorage.setItem("game-over",JSON.stringify(false))
  }

  if (grid.length === 0) return <div>Loading</div>;

  return (
    <div className="h-screen bg-gray-800 font-bold flex flex-col justify-center items-center">
      {
        gameOver.current && 
        <div className="flex flex-col justify-center items-center">
            <div className="text-white">
              Game Over!
            </div>
        </div>
      }
      <button className="h-10 w-40 bg-blue-300" onClick={startNewGame}>New Game</button>
      <div
        style={{ backgroundColor: "#bbada0" }}
        className="sm:h-[550px] sm:w-[550px] h-[300px] w-[300px] flex justify-between flex-wrap p-3 rounded-md relative mt-[50px]"
      >
        {emptyGrid.map((tile, ind) => (
          <div
            style={{ backgroundColor: "#EEE4DA8C" }}
            className="sm:h-[120px] sm:w-[120px] m-1 rounded-sm h-[60px] w-[60px]"
            key={ind}
          ></div>
        ))}
        {grid.map((tilesSubArray, row) => {
          return tilesSubArray.map((tile, col) => {
            return tile ? <Tile tileData={{ tile, row, col }} /> : null;
          });
        })}
      </div>
    </div>
  );
};

export default App;
