const getEmptyGrid = () => {
  return Array(4)
    .fill([])
    .map((a) => Array(4).fill(null));
};

export const getTileColorClass = (val) => {
  switch (val) {
    case 2:
      return "#eee4da";
    case 4:
      return "#eee1c9";
    case 8:
      return "#f3b27a";
    case 16:
      return "#f69664";
    case 32:
      return "#f77c5f";
    case 64:
      return "#f75f3b";
    case 128:
      return "#edd073";
    case 256:
      return "#edcc62";
    case 512:
      return "#edc950";
    case 1024:
      return "#34eb46";
    case 2048:
      return "#34ebdb";
    default:
      return "#ffffff";
  }
};

const getModifiedTiles = (tilesString) => {
  const tilesStringLength = tilesString.length;
  let ind = 0;
  let resTiles = [];

  while (ind < tilesStringLength) {
    if (tilesString[ind] === "") ind += 1;
    else if (ind === tilesStringLength - 1) {
      resTiles.push({ value: tilesString[ind], isMerged: false });
      ind += 1;
    } else if (tilesString[ind] === tilesString[ind + 1]) {
      resTiles.push({
        value: tilesString[ind] + tilesString[ind + 1],
        isMerged: true,
      });
      ind += 2;
    } else {
      resTiles.push({ value: tilesString[ind], isMerged: false });
      ind += 1;
    }
  }
  return resTiles;
};

export const moveUp = (grid) => {
  let isSame=true
  const newGrid = getEmptyGrid();

  for (let i = 0; i < 4; i++) {
    let colTiles = [];
    for (let j = 0; j < 4; j++) {
      if (grid[j][i]) {
        colTiles.push(grid[j][i].value);
      }
    }
    const newTiles = getModifiedTiles(colTiles);
    isSame = isSame && JSON.stringify(newTiles.map((tile)=>tile.value)) === JSON.stringify(colTiles) && [0,4].includes(newTiles.length)
    for (let k = 0; k < newTiles.length; k++) {
      newGrid[k][i] = newTiles[k];
    }
  }

  return {newGrid,isSame};
};

export const moveDown = (grid) => {
  let isSame=true
  const newGrid = getEmptyGrid();

  for (let i = 0; i < 4; i++) {
    let colTiles = [];
    for (let j = 3; j > -1; j--) {
      if (grid[j][i]) {
        colTiles.push(grid[j][i].value);
      }
    }
    const newTiles = getModifiedTiles(colTiles);
    isSame = isSame && JSON.stringify(newTiles.map((tile)=>tile.value)) === JSON.stringify(colTiles) && [0,4].includes(newTiles.length)
    for (let k = 0; k < newTiles.length; k++) {
      newGrid[3 - k][i] = newTiles[k];
    }
  }

  return {newGrid,isSame};
};

export const moveLeft = (grid) => {
  let isSame=true
  const newGrid = getEmptyGrid();

  for (let i = 0; i < 4; i++) {
    let rowTiles = [];
    for (let j = 0; j < 4; j++) {
      if (grid[i][j]) {
        rowTiles.push(grid[i][j].value);
      }
    }

    const newTiles = getModifiedTiles(rowTiles);
    isSame = isSame && JSON.stringify(newTiles.map((tile)=>tile.value)) === JSON.stringify(rowTiles) && [0,4].includes(newTiles.length)
    for (let k = 0; k < newTiles.length; k++) {
      newGrid[i][k] = newTiles[k];
    }
  }

  return {newGrid,isSame};
};

export const moveRight = (grid) => {
  let isSame=true
  const newGrid = getEmptyGrid();

  for (let i = 0; i < 4; i++) {
    let rowTiles = [];
    for (let j = 3; j > -1; j--) {
      if (grid[i][j]) {
        rowTiles.push(grid[i][j].value);
      }
    }
    const newTiles = getModifiedTiles(rowTiles);
    isSame = isSame && JSON.stringify(newTiles.map((tile)=>tile.value)) === JSON.stringify(rowTiles) && [0,4].includes(newTiles.length)
    for (let k = 0; k < newTiles.length; k++) {
      newGrid[i][3 - k] = newTiles[k];
    }
  }

  return {newGrid,isSame};
};

export const getPositions = (row, col) => {
  const isMinScreen = window.innerWidth <= 640;
  if (isMinScreen) {
    const topPosition = `${13 + 69 * row}px`;
    const leftPosition = `${13 + 69 * col}px`;
    return { topPosition, leftPosition };
  } else {
    const topPosition = `${12 + 132 * row}px`;
    const leftPosition = `${12 + 132 * col}px`;
    return { topPosition, leftPosition };
  }
};

export const generateNewTile = (grid) => {
  const emptyCellIndices = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === null) {
        emptyCellIndices.push({ row, col });
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyCellIndices.length);
  const randomEmptyCell = emptyCellIndices[randomIndex];
  const randomValue = Math.random() < 0.75 ? 2 : 4;

  return { tile: { value: randomValue, isMerged: true }, ...randomEmptyCell };
};

export const generateInitialTiles = () => {
  const tiles = getEmptyGrid();

  let random1, random2;
  do {
    random1 = Math.floor(Math.random() * 16);
    random2 = Math.floor(Math.random() * 16);
  } while (random1 === random2);

  const tileOneValue = Math.random() < 0.75 ? 2 : 4;
  const tileTwoValue = Math.random() < 0.75 ? 2 : 4;

  tiles[Math.floor(random1 / 4)][random1 % 4] = {
    value: tileOneValue,
    isMerged: false,
  };

  tiles[Math.floor(random2 / 4)][random2 % 4] = {
    value: tileTwoValue,
    isMerged: false,
  };
  return tiles;
};

export const isGameOver=(grid)=>{
  const moves=[moveLeft,moveRight,moveDown,moveUp];
  for(let move of moves) {
    const {newGrid}=move(grid);
    const { _, row, col } = generateNewTile(newGrid);
    if(row!==undefined && col!==undefined)  return false
  }
  return true
}