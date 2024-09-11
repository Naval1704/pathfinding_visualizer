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

  const handleVisualizeAlgorithm = () => {
    if (gridRef.current) {
      gridRef.current.visualizeAlgorithm(algorithm);
    }
  };

  const handleVisualizePattern = () => {
    if (gridRef.current) {
      gridRef.current.visualizePattern(pattern);
    }
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    if (e.target.value) {
      e.target.classList.add("selected");
    } else {
      e.target.classList.remove("selected");
    }
  };

  const handlePatternChange = (e) => {
    setPattern(e.target.value);
    if (e.target.value) {
      e.target.classList.add("selected");
    } else {
      e.target.classList.remove("selected");
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
    if (e.target.value) {
      e.target.classList.add("selected");
    } else {
      e.target.classList.remove("selected");
    }
  };

  return (
    <div className="App">
      <div className="left-column">
        <h1 className="app-title">Pathfinding Visualizer</h1>

        <div className="instructions">
          <h2>Instructions</h2>
          <ol>
            <li>Select a pattern (optional) or create walls manually.</li>
            <li>Choose a speed from the dropdown menu.</li>
            <li>Select an algorithm to visualize.</li>
            <li>Click "Make Pattern" to generate the grid.</li>
            <li>
              Click "Visualize Algorithm" to see the selected algorithm in
              action.
            </li>
          </ol>
        </div>

        {/* Dropdown for algorithms and pattern selections */}
        <div className="dropdown-menu">
          {/* Selecting patterns */}
          <div className="dropdown">
            <label htmlFor="pattern">Pattern:</label>
            <select
              id="pattern"
              name="pattern"
              value={pattern}
              onChange={handlePatternChange}
            >
              <option value="">Select Pattern</option>
              <option value="Prims_maze">Prim's Algorithm maze</option>
            </select>
          </div>

          {/* Select speed */}
          <div className="dropdown">
            <label htmlFor="speed">Speed:</label>
            <select
              id="speed"
              name="speed"
              value={speed}
              onChange={handleSpeedChange}
            >
              <option value="">Select Speed</option>
              <option value="fast">Fast</option>
              <option value="medium">Medium</option>
              <option value="slow">Slow</option>
            </select>
          </div>

          {/* Selecting algorithms */}
          <div className="dropdown">
            <label htmlFor="algorithm">Algorithm:</label>
            <select
              id="algorithm"
              name="algorithm"
              value={algorithm}
              onChange={handleAlgorithmChange}
            >
              <option value="">Select Algorithm</option>
              <option value="Dijkstra's_Algorithm">Dijkstra's Algorithm</option>
              <option value="Breadth_first_Search">
                Breadth-first Search Algorithm
              </option>
              <option value="Depth_first_Search">
                Depth-first Search Algorithm
              </option>
              <option value="A_star">A* Algorithm</option>
            </select>
          </div>
        </div>

        <hr className="partition-line" />
        <button
          className="visualize-pattern-button"
          onClick={handleVisualizePattern}
        >
          Make Pattern
        </button>
        <hr className="partition-line" />
        <button className="visualize-button" onClick={handleVisualizeAlgorithm}>
          Visualize Algorithm
        </button>

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
            <strong>Algorithm:</strong> {algorithm || "None"} |{" "}
            <strong>Pattern:</strong> {pattern || "None"} |{" "}
            <strong>Speed:</strong> {speed || "None"}
          </p>
        </div>
        <Grid
          ref={gridRef}
          algorithm={algorithm}
          pattern={pattern}
          speed={speed}
        />
      </div>
    </div>
  );
}

export default App;
