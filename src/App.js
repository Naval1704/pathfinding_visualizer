import React from "react";
import { FaPlay, FaStop } from "react-icons/fa";
// import React from "react";
function App() {
  return (
    <div className="App">
      <div className="left-column">
        <h1 className="app-title">Pathfinding Visualizer</h1>

        {/* Dropdown for algorithms and pattern selections */}
        <div className="dropdown-menu">

          {/* Selecting algorithms */}
          <div className="dropdown">
            <label htmlFor="algorithm">Algorithm:</label>
            <select id="algorithm" name="algorithm">
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="aStar">A*</option>
              <option value="greedy">Greedy best-first search</option>
              <option value="swarm">Swarm algo</option>
              <option value="convergentSwarm">Convergent swarm algo</option>
              <option value="bidirectionalSwarm">
                Bidirectional swarm algo
              </option>
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
            </select>
          </div>

          {/* selecting patterns  */}
          <div className="dropdown">
            <label htmlFor="pattern">Pattern:</label>
            <select id="pattern" name="pattern">
              <option value="pattern1">Pattern 1</option>
              <option value="pattern2">Pattern 2</option>
              <option value="pattern3">Pattern 3</option>
              <option value="pattern4">Pattern 4</option>
              <option value="pattern5">Pattern 5</option>
              <option value="pattern6">Pattern 6</option>
            </select>
          </div>

          {/* Select speed  */}
          <div className="speed">
            <label htmlFor="speed">Speed:</label>
            <select id="speed" name="speed">
              <option value="fast">Fast</option>
              <option value="medium">Medium</option>
              <option value="slow">Slow</option>
            </select>
          </div>
        </div>

        <hr className="partition-line" />

        <button className="visualize-button">Visualize</button>

        <hr className="partition-line" />

        <div className="remove-patterns">
          <div className="clear-board">
            <button>Clear Board</button>
          </div>

          <div className="clear-walls-weights">
            <button>Clear Walls & Weights</button>
          </div>

          <div className="clear-path">
            <button>Clear Path</button>
          </div>
        </div>

        <hr className="partition-line" />

        <div className="node-icons">
          <div className="start-node">
            <FaPlay />
            <span>Start Node</span>
          </div>

          <div className="end-node">
            <FaStop />
            <span>End Node</span>
          </div>
        </div>

        <div className="color-codes">
          <div className="color-code">
            <div className="color white"></div>
            <span>Unvisited</span>
          </div>
          <div className="color-code">
            <div className="color blue"></div>
            <span>Visited Nodes</span>
          </div>
          <div className="color-code">
            <div className="color yellow"></div>
            <span>Shortest Path</span>
          </div>
          <div className="color-code">
            <div className="color black"></div>
            <span>Walls</span>
          </div>
        </div>
      </div>

      <div className="right-workspace"></div>
    </div>
  );
}

export default App;
