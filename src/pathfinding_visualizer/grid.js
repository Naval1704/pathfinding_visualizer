import React, { Component } from "react";
import "./styles/grid.css";
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import Node from "./node";

const STARTING_ROW = (Math.floor(window.innerHeight / 29) - 1)/2;
const STARTING_COL = 0;

const TARGET_ROW = (Math.floor(window.innerHeight / 29) - 1)/2;
const TARGET_COL = Math.floor(window.innerWidth / 32) - 1;

export default class grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: { row: STARTING_ROW, col: STARTING_COL },
      targetNode: { row: TARGET_ROW, col: TARGET_COL },
    };
  }

  // for creating grid
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
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

  /**
   * Handles the mouse down event on the grid.
   * Toggles the wall state of the cell at the specified row and column.
   * Updates the grid state and sets the mouseIsPressed state to true.
   */
  handleMouseDown = (row, col) => {
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  // Handles the mouse up event on the grid.
  // Sets the mouseIsPressed state to false.
  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  // for toggling walls when mouse enters a node
  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  clearBoard = () => {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  };

  animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[STARTING_ROW][STARTING_COL];
    const finishNode = grid[TARGET_ROW][TARGET_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid } = this.state;
    return (
      <div className="grid-container">
        <div className="grid">
          {/* <p>Let's visualize {algorithm} with {pattern} pattern and {speed} speed</p> */}
          {grid.map((row, rowIndx) => {
            return (
              <div key={rowIndx} className="grid-row">
                {row.map((node, nodeIndx) => {
                  const { row, col, isStart, isTarget, isWall } = node;
                  return (
                    <Node
                      key={rowIndx}
                      row={row}
                      col={col}
                      isTarget={isTarget}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
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
