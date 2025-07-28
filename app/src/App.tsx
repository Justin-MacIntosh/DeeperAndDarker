import Card from './components/Card';

const App = () => {
  return (
    <>
      <header className="header">
        <div className="planet-description">
          <h1>PLANET GOBAJ</h1>
          <h3 style={{"paddingLeft": "5px"}}>SWAMP BIOME</h3>
        </div>
      </header>
      <div className="main">
        <div className="content">
          <div className="content-planetary-row">
            <div className="planet-display"></div>
            <div className="planetary-data-display">
              <h3>PLANETARY DATA</h3>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h1 className="bots-title">AUTOMATONS</h1>
          <div className="robot-container">
            <h2 className="robot-name">MNR-N1</h2>
            <Card
              color="blue"
              iconName="fa-robot"
              contentElement={<>Basic resource miner</>}
              suffixElement={<>1<i className="fa-solid fa-dollar-sign fa-xs"></i></>}
            />
          </div>
          {/* <div className="robot-container">
            <h2 className="robot-name">MNR-X1</h2>
            <Card
              color="red"
              iconName="fa-robot"
              contentElement={<>Supercharged miner</>}
              suffixElement={<>1<i className="fa-solid fa-dollar-sign fa-xs"></i></>}
            />
          </div>
          <div className="robot-container">
            <h2 className="robot-name">MNR-S1</h2>
            <Card
              color="green"
              iconName="fa-robot"
              contentElement={<>Miner that works better with space</>}
              suffixElement={<>1<i className="fa-solid fa-dollar-sign fa-xs"></i></>}
            />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default App;
