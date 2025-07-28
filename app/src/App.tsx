import Card from './components/Card';

const App = () => {
  return (
    <>
      <header>
        <div className="planet-description">
          <h1>PLANET GOBAJ</h1>
          <h3 style={{"paddingLeft": "5px"}}>SWAMP BIOME</h3>
        </div>
      </header>
      <div className="main">
        <div className="content">
          <div className="content-row-1 row">
            <div className="planet-display"></div>
            <div className="mining-display">
              <h3>PLANETARY RESOURCES</h3>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h1 className="bots-title">AUTOMATONS</h1>
          <div className="robot-container">
            <h2 className="robot-name">MNR-N1</h2>
            <Card
              color="blue"
              icon={<span className="fa-solid fa-robot fa-3x"></span>}
              content={<>Basic resource miner</>}
              suffix={<>1<i className="fa-solid fa-dollar-sign fa-xs"></i></>}
            />
          </div>
          <div className="robot-container">
            <h2 className="robot-name">MNR-X1</h2>
            <Card
              color="red"
              icon={<span className="fa-solid fa-robot fa-3x"></span>}
              content={<>Supercharged gatherer</>}
              suffix={<>1<i className="fa-solid fa-dollar-sign fa-xs"></i></>}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
