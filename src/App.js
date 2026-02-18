import React, { useState, useRef, useCallback } from "react";
import Grid from "./pathfinding_visualizer/grid";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  const [pattern, setPattern] = useState("");
  const [speed, setSpeed] = useState("");
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const gridRef = useRef(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleClearBoard = () => {
    if (gridRef.current) {
      gridRef.current.clearBoard();
      setStats(null);
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
      setStats(null);
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
  };

  const handlePatternChange = (e) => {
    setPattern(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const algorithmDisplayName = (algo) => {
    switch (algo) {
      case "Dijkstra's_Algorithm": return "Dijkstra's";
      case "Breadth_first_Search": return "BFS";
      case "Depth_first_Search": return "DFS";
      case "A_star": return "A*";
      default: return "None";
    }
  };

  return (
    <div className="App">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="toolbar">
        <h1 className="app-title"><span>Pathfinding</span> Visualizer</h1>

        <div className="toolbar-controls">
          <div className="control-group">
            <select
              id="algorithm"
              className="neon-select"
              value={algorithm}
              onChange={handleAlgorithmChange}
            >
              <option value="">Algorithm</option>
              <option value="Dijkstra's_Algorithm">Dijkstra's</option>
              <option value="Breadth_first_Search">BFS</option>
              <option value="Depth_first_Search">DFS</option>
              <option value="A_star">A*</option>
            </select>

            <select
              id="speed"
              className="neon-select"
              value={speed}
              onChange={handleSpeedChange}
            >
              <option value="">Speed</option>
              <option value="fast">Fast</option>
              <option value="medium">Medium</option>
              <option value="slow">Slow</option>
            </select>

            <select
              id="pattern"
              className="neon-select"
              value={pattern}
              onChange={handlePatternChange}
            >
              <option value="">Maze</option>
              <option value="Prims_maze">Prim's Maze</option>
            </select>
          </div>

          <div className="control-group">
            <button
              className="btn btn-pattern"
              onClick={handleVisualizePattern}
            >
              Generate Maze
            </button>
            <button
              className="btn btn-visualize"
              onClick={handleVisualizeAlgorithm}
            >
              Visualize
            </button>
          </div>

          <div className="control-group">
            <button className="btn btn-clear" onClick={handleClearPath}>
              Clear Path
            </button>
            <button className="btn btn-clear" onClick={handleClearWalls}>
              Clear Walls
            </button>
            <button className="btn btn-clear" onClick={handleClearBoard}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Legend Strip */}
      <div className="legend-strip">
        <div className="legend-item">
          <div className="legend-swatch legend-start"></div>
          <span>Start</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-end"></div>
          <span>End</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-unvisited"></div>
          <span>Unvisited</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-visited"></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-path"></div>
          <span>Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-wall"></div>
          <span>Wall</span>
        </div>
      </div>

      {/* Full-screen Grid */}
      <div className="grid-workspace">
        <Grid
          ref={gridRef}
          algorithm={algorithm}
          pattern={pattern}
          speed={speed}
          showToast={showToast}
          onStats={setStats}
        />
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>
          Algorithm: <strong>{algorithmDisplayName(algorithm)}</strong>
        </span>
        <span>
          Speed: <strong>{speed || "Default"}</strong>
        </span>
        {stats && (
          <>
            <span>
              Visited: <strong className="stat-cyan">{stats.visited}</strong>
            </span>
            <span>
              Path Length: <strong className="stat-gold">{stats.pathLength}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
