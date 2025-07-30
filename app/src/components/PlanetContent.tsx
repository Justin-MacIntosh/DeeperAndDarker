import { memo } from 'react';

const PlanetContent = memo(() => {
  return (
    <div
      id="content"
      className="
        min-w-[500px] flex-grow-[4]
        rounded-xl
        flex flex-col gap-3"
    >
      <div
        id="content-planetary-row"
        className="flex flex-col 2xl:flex-row rounded-xl gap-3"
      >
        <div
          id="planet-display"
          className="
            min-h-[400px] bg-black
            w-full rounded-xl
            2xl:w-[500px] 2xl:rounded-l-xl 2xl:rounded-r-none"
        ></div>
        <div
          id="planetary-data-display"
          className="
            p-4 min-h-[400px] bg-light-purple
            flex-1 rounded-xl
            2xl:rounded-l-none 2xl:rounded-r-xl"
        >
          <h3>PLANETARY DATA</h3>
        </div>
      </div>
      <div className="content-structures-row">
        <div
          id="structure-display"
          className="
            p-4 min-h-[400px] bg-light-purple
            flex-1 rounded-xl"
        >
          <h3>STRUCTURES</h3>
        </div>
      </div>
    </div>
  )
});

export default PlanetContent;
