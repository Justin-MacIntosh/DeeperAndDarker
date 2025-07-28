import './App.css';

function App() {
  return (
    <>
      <div className="planet-description">
        <h1>PLANET GOBAJ</h1>
        <h3 style={{"paddingLeft": "5px"}}>SWAMP BIOME</h3>
      </div>
      <div className="main">
        <div className="content">
          <div className="content-row-1 row">
            <div className="planet-display"></div>
            <div className="mining-display">
              <h3>PLANETARY RESOURCES</h3>
            </div>
          </div>
          <div className="content-row-2 row">
            <div className="expeditions-display"></div>
            <div className="dungeoneers-display">
              <div className="card-container">
                <div className="card card-blue noselect">
                  <div className="card-icon">
                    <span className="fa-solid fa-truck fa-3x"></span>
                  </div>
                  <div className="card-description">
                    <div className="column">
                      <div>
                        <b>PR:</b> Magma
                      </div>
                      <div>
                        <b>LD:</b> 20
                      </div>
                    </div>
                    <div className="column">
                      <div>
                        <b>STR:</b> 9
                      </div>
                      <div>
                        <b>DEF:</b> 12
                      </div>
                    </div>
                  </div>
                  <div className="card-cost">YUKIL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h1 className="bots-title">AUTOMATONS</h1>
          <div className="card-container">
            <h2 className="card-name">MNR-N1</h2>
            <div className="card card-blue noselect">
              <div className="card-icon">
                <span className="fa-solid fa-robot fa-3x"></span>
              </div>
              <div className="card-description">Basic resource miner</div>
              <div className="card-cost">
                1<i className="fa-solid fa-dollar-sign fa-xs"></i>
              </div>
            </div>
          </div>
          <div className="card-container">
            <h2 className="card-name">MNR-X1</h2>
            <div className="card card-red noselect">
              <div className="card-icon">
                <span className="fa-solid fa-robot fa-3x"></span>
              </div>
              <div className="card-description">Supercharged gatherer</div>
              <div className="card-cost">
                1<i className="fa-solid fa-dollar-sign fa-xs"></i>
              </div>
            </div>
          </div>
          <h1 className="characters-title">DUNGEONEERS</h1>
          <div className="card-container">
            <div className="card card-blue noselect">
              <div className="card-icon">
                <span className="fa-solid fa-truck fa-3x"></span>
              </div>
              <div className="card-description">
                <div className="column">
                  <div>
                    <b>PR:</b> Magma
                  </div>
                  <div>
                    <b>LD:</b> 20
                  </div>
                </div>
                <div className="column">
                  <div>
                    <b>STR:</b> 9
                  </div>
                  <div>
                    <b>DEF:</b> 12
                  </div>
                </div>
              </div>
              <div className="card-cost">YUKIL</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
