import { getPositions, getTileColorClass } from "../helper/helper";

const Tile = ({ tileData }) => {
  const { tile, row, col } = tileData;
  const { topPosition, leftPosition } = getPositions(row, col);
  console.log(topPosition, leftPosition);
  const tileColorClass = getTileColorClass(tile.value);
  return (
    <>
      <div
        style={{
          top: topPosition,
          left: leftPosition,
          backgroundColor: tileColorClass,
        }}
        className={`sm:h-[122px] sm:w-[125px] h-[60px] w-[60px] m-[3px] rounded-sm text-lg sm:text-5xl flex justify-center items-center absolute ${
          tile.isMerged ? "tile" : ""
        }`}
      >
        {tile.value}
      </div>
    </>
  );
};

export default Tile;
