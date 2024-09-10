import React, { Component } from "react";
import "./styles/grid.css";
import Node from "./node";

import { dijkstra, createPath } from "../algorithms/dijkstra";
import { bfs, createPathBFS } from "../algorithms/bfs";
import { dfs, createPathDFS } from "../algorithms/dfs";

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: null,
      targetNode: null,
      selectingStartNode: false,
      selectingEndNode: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    const rows = Math.floor(window.innerHeight / 28);
    const cols = Math.floor(window.innerWidth / 32);
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: false,
      isTarget: false,
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
    const { selectingStartNode, selectingEndNode } = this.state;
    if (selectingStartNode) {
      this.setStartNode(row, col);
    } else if (selectingEndNode) {
      this.setEndNode(row, col);
    } else {
      const newGrid = this.wallToggle(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  setStartNode = (row, col) => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    if (this.state.startNode) {
      newGrid[this.state.startNode.row][this.state.startNode.col].isStart = false;
    }
    newGrid[row][col].isStart = true;
    this.setState({
      grid: newGrid,
      startNode: { row, col },
      selectingStartNode: false,
    });
  };

  setEndNode = (row, col) => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    if (this.state.targetNode) {
      newGrid[this.state.targetNode.row][this.state.targetNode.col].isTarget = false;
    }
    newGrid[row][col].isTarget = true;
    this.setState({
      grid: newGrid,
      targetNode: { row, col },
      selectingEndNode: false,
    });
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
    const { startNode, targetNode } = this.state;
    if (!startNode || !targetNode) {
      alert("Please select start node and end node !!");
      return;
    }

    if (algorithm === "Dijkstra's_Algorithm") {
      this.visualizeDijkstra();
    } else if (algorithm === "Breadth_first_Search") {
      this.visualizeBFS();
    } else if (algorithm === "Depth_first_Search") {
      this.visualizeDFS();
    }
  };

  visualizeBFS() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode = grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = bfs(grid, startNode, finishNode);
    const shortestPath = createPathBFS(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode = grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = dfs(grid, startNode, finishNode);
    const shortestPath = createPathDFS(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode = grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = dijkstra(grid, startNode, finishNode);
    const shortestPath = createPath(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  render() {
    const { grid } = this.state;
    return (
      <div className="grid-container">
        <div className="controls">
          <button className="control-button-green" onClick={() => this.setState({ selectingStartNode: true, selectingEndNode: false })}>
            Select Start Node
          </button>
          <button className="control-button-red" onClick={() => this.setState({ selectingEndNode: true, selectingStartNode: false })}>
            Select End Node
          </button>
        </div>
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