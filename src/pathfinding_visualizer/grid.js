import React, { Component } from "react";
import "./styles/grid.css";
import Node from "./node";

import { dijkstra, createPath } from "../algorithms/dijkstra";

const STARTING_ROW = (Math.floor(window.innerHeight / 29) - 1) / 2;
const STARTING_COL = 0;

const TARGET_ROW = (Math.floor(window.innerHeight / 29) - 1) / 2;
const TARGET_COL = Math.floor(window.innerWidth / 32) - 1;

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: { row: STARTING_ROW, col: STARTING_COL },
      targetNode: { row: TARGET_ROW, col: TARGET_COL },
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid }, () => {
      this.applyPattern(this.props.pattern);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pattern !== this.props.pattern) {
      this.applyPattern(this.props.pattern);
    }
  }

  getInitialGrid = () => {
    const { startNode, targetNode } = this.state;
    const grid = [];
    const rows = Math.floor(window.innerHeight / 28);
    const cols = Math.floor(window.innerWidth / 32);
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(this.createNode(row, col, startNode, targetNode));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col, startNode, targetNode) => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isTarget: row === targetNode.row && col === targetNode.col,
      distance: Infinity,
      isVisited: false,
      isShortestPath: false,
      isWall: false,
      prevNode: null,
    };
  };

  wallToggle = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (node.isWall) {
      return newGrid;
    }

    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  handleMouseDown = (row, col) => {
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  clearBoard = () => {
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        if (node.isStart || node.isTarget) {
          return node;
        }
        document.getElementById(`node-${node.row}-${node.col}`).className = "node";
        return {
          ...node,
          isWall: false,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          prevNode: null,
        };
      })
    );
    this.setState({ grid: newGrid });
  };

  clearWalls = () => {
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        if (node.isWall) {
          return { ...node, isWall: false };
        }
        return node;
      })
    );
    this.setState({ grid: newGrid });
  };

  clearPath = () => {
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        if (node.isStart || node.isTarget) {
          return node;
        }
        if (node.isVisited || node.isShortestPath) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node";
          return {
            ...node,
            isVisited: false,
            isShortestPath: false,
            distance: Infinity,
            prevNode: null,
          };
        }
        return node;
      })
    );
    this.setState({ grid: newGrid });
  };

  animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {
    const speed = this.getAnimationSpeed();
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isTarget) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
        }
      }, speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const speed = this.getAnimationSpeed();
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isTarget) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
        }
      }, speed * i);
    }
  }

  applyPattern(pattern) {
    let newGrid = this.state.grid.slice();
    if (pattern === "Maze") {
      newGrid = this.generateRecursiveDivision(newGrid);
    } else {
      newGrid = this.getInitialGrid();
    }
    this.setState({ grid: newGrid });
  }

  generateRecursiveDivision(grid) {
    const rows = Math.floor(window.innerHeight / 28);
    const cols = Math.floor(window.innerWidth / 32);
    const wallSpacing = 4; // Parameterize wall spacing
  
    // Function to add walls in a specific pattern
    const addWalls = (startRow, endRow, colOffset) => {
      for (let row = startRow; row < endRow; row++) {
        for (let col = colOffset; col < cols; col += wallSpacing) {
          grid[row][col].isWall = true;
        }
      }
    };
  
    // Dynamically generate wall patterns based on screen size
    const wallPatterns = [];
    const numPatterns = 6; // Number of patterns to generate
    const rowIncrement = Math.floor(rows / numPatterns);
  
    for (let i = 0; i < numPatterns; i++) {
      const startRow = i * rowIncrement;
      const endRow = (i + 1) * rowIncrement;
      const colOffset = (i % 2 === 0) ? 2 : 4; // Alternate colOffset for variety
      wallPatterns.push({ startRow, endRow, colOffset });
    }
  
    // Add walls based on the defined patterns
    wallPatterns.forEach(pattern => {
      const { startRow, endRow, colOffset } = pattern;
      addWalls(startRow, endRow, colOffset);
    });
  
    return grid;
  }

  getAnimationSpeed() {
    const { speed } = this.props;
    switch (speed) {
      case "fast":
        return 2;
      case "medium":
        return 20;
      case "slow":
        return 40;
      default:
        return 10;
    }
  }

  visualizeAlgorithm = (algorithm) => {
    if (algorithm === "Dijkstra's_Algorithm") {
      this.visualizeDijkstra();
    }
  };

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[STARTING_ROW][STARTING_COL];
    const finishNode = grid[TARGET_ROW][TARGET_COL];
    const visitedNodes = dijkstra(grid, startNode, finishNode);
    const shortestPath = createPath(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  render() {
    const { grid } = this.state;
    return (
      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIndx) => {
            return (
              <div key={rowIndx} className="grid-row">
                {row.map((node, nodeIndx) => {
                  const { row, col, isStart, isTarget, isWall } = node;
                  return (
                    <Node
                      key={`${rowIndx}-${nodeIndx}`}
                      row={row}
                      col={col}
                      isTarget={isTarget}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}