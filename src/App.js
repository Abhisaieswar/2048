import "./App.css";
import { useEffect, useState } from "react";
import {
  generateInitialTiles,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  generateNewTile,
} from "./helper/helper";
import Tile from "./components/Tile.js";

const App = () => {
  const [grid, setGrid] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const emptyGrid = Array(16).fill(0);
  let storedTiles;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    storedTiles = JSON.parse(localStorage.getItem("2048-board"));
    if (!storedTiles) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      storedTiles = generateInitialTiles();

      localStorage.setItem("2048-board", JSON.stringify(storedTiles));
    }
    setGrid(storedTiles);

    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleKey = (e) => {
    if (e.key === "ArrowUp") {
      storedTiles = moveUp(storedTiles);
      setGrid(storedTiles);
    } else if (e.key === "ArrowDown") {
      storedTiles = moveDown(storedTiles);
      setGrid(storedTiles);
    } else if (e.key === "ArrowLeft") {
      storedTiles = moveLeft(storedTiles);
      setGrid(storedTiles);
    } else if (e.key === "ArrowRight") {
      storedTiles = moveRight(storedTiles);
      setGrid(storedTiles);
    } else {
      return;
    }

    const { tile, row, col } = generateNewTile(storedTiles);
    storedTiles[row][col] = tile;
    localStorage.setItem("2048-board", JSON.stringify(storedTiles));
    setGrid(storedTiles);
  };

  if (grid.length === 0) return <div>Loading</div>;

  return (
    <div className="h-screen bg-gray-800 font-bold flex justify-center">
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
