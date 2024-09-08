import React, { useState, useRef } from "react";
import Grid from "./pathfinding_visualizer/grid";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  const [pattern, setPattern] = useState("");
  const [speed, setSpeed] = useState("");
  const gridRef = useRef(null);

  const handleClearBoard = () => {
    if (gridRef.current) {
      gridRef.current.clearBoard();
    }
  };

  const handleClearWalls = () => {
    if (gridRef.current) {
      gridRef.current.clearWalls();
    }
  };

  const handleClearPath = () => {
    if (gridRef.current) {
      gridRef.current.clearPath();
    }
  };

  const handleVisualize = () => {
    if (gridRef.current) {
      gridRef.current.visualizeAlgorithm(algorithm);
    }
  };

  return (
    <div className="App">
      <div className="left-column">
        <h1 className="app-title">Pathfinding Visualizer</h1>

        {/* Dropdown for algorithms and pattern selections */}
        <div className="dropdown-menu">
          {/* Selecting algorithms */}
          <div className="dropdown">
            <label htmlFor="algorithm">Algorithm:</label>
            <select
              id="algorithm"
              name="algorithm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="">Select Algorithm</option>
              <option value="Dijkstra's_Algorithm">Dijkstra's Algorithm</option>
              {/* <option value="A*_Search">A* Search</option> */}
              {/* <option value="Greedy_Best_first_Search">Greedy Best-first Search</option>
              <option value="Swarm_Algorithm">Swarm Algorithm</option>
              <option value="Convergent_Swarm_Algorithm">
                Convergent Swarm Algorithm
              </option>
              <option value="Bidirectional_Swarm_Algorithm">
                Bidirectional Swarm Algorithm
              </option> */}
              <option value="Breadth_first_Search">Breadth-first Search</option>
              <option value="Depth_first_Search">Depth-first Search</option>
            </select>
          </div>

          {/* Selecting patterns */}
          <div className="dropdown">
            <label htmlFor="pattern">Pattern:</label>
            <select
              id="pattern"
              name="pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            >
              <option value="">Select Pattern</option>
              {/* <option value="Maze">Maze</option> */}
              {/* <option value="Recursive_Division_(vertical_skew)">Recursive Division (vertical skew)</option>
              <option value="Recursive_Division_(horizontal_skew)">Recursive Division (horizontal skew)</option>
              <option value="Basic_Random_Maze">Basic Random Maze</option>
              <option value="Simple_Stair_Pattern">Simple Stair Pattern</option> */}
            </select>
          </div>

          {/* Select speed */}
          <div className="speed">
            <label htmlFor="speed">Speed:</label>
            <select
              id="speed"
              name="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            >
              <option value="">Select Speed</option>
              <option value="fast">Fast</option>
              <option value="medium">Medium</option>
              <option value="slow">Slow</option>
            </select>
          </div>
        </div>

        <hr className="partition-line" />

        <button className="visualize-button" onClick={handleVisualize}>Visualize</button>

        <hr className="partition-line" />

        <div className="remove-patterns">
          <div className="clear-board">
            <button onClick={handleClearBoard}>Clear Board</button>
          </div>

          <div className="clear-walls-weights">
            <button onClick={handleClearWalls}>Clear Walls</button>
          </div>

          <div className="clear-path">
            <button onClick={handleClearPath}>Clear Path</button>
          </div>
        </div>

        <hr className="partition-line" />

        <div className="node-icons">
          <div className="start-node">
            <div className="color green"></div>
            <span>Start Node</span>
          </div>

          <div className="end-node">
            <div className="color red"></div>
            <span>End Node</span>
          </div>
        </div>

        <div className="color-codes">
          <div className="color-code">
            <div className="color white"></div>
            <span>Unvisited Nodes</span>
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

      <div className="right-workspace">
        <div className="selected-info">
          <p>
            <strong>Algorithm:</strong> {algorithm || "None"} | <strong>Pattern:</strong> {pattern || "None"} | <strong>Speed:</strong> {speed || "None"}
          </p>
        </div>
        <Grid ref={gridRef} algorithm={algorithm} pattern={pattern} speed={speed} />
      </div>
    </div>
  );
}

export default App;