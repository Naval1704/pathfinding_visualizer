import React, { Component } from "react";
import "./styles/grid.css";
import Node from "./node";

import { dijkstra, createPath } from "../algorithms/dijkstra";
import { bfs, createPathBFS } from "../algorithms/bfs";
import { dfs, createPathDFS } from "../algorithms/dfs";
import { astar, createPathAstar } from "../algorithms/A_star";
import { primsMaze } from "../algorithms/maze generation/prims_maze";

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
      isAnimating: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    const rows = Math.floor((window.innerHeight - 120) / 26);
    const cols = Math.floor(window.innerWidth / 26);
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
    if (this.state.isAnimating) return;
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
    if (this.state.isAnimating) return;
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.wallToggle(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  setStartNode = (row, col) => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    if (this.state.startNode) {
      newGrid[this.state.startNode.row][
        this.state.startNode.col
      ].isStart = false;
    }
    newGrid[row][col].isStart = true;
    this.setState({
      grid: newGrid,
      startNode: { row, col },
      selectingStartNode: false,
    });
    this.props.showToast("Start node placed!", "success");
  };

  setEndNode = (row, col) => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    if (this.state.targetNode) {
      newGrid[this.state.targetNode.row][
        this.state.targetNode.col
      ].isTarget = false;
    }
    newGrid[row][col].isTarget = true;
    this.setState({
      grid: newGrid,
      targetNode: { row, col },
      selectingEndNode: false,
    });
    this.props.showToast("End node placed!", "success");
  };

  clearBoard = () => {
    if (this.state.isAnimating) return;
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
        return {
          ...node,
          isStart: false,
          isTarget: false,
          isWall: false,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          prevNode: null,
        };
      })
    );
    this.setState({ grid: newGrid, startNode: null, targetNode: null });
    if (this.props.onStats) this.props.onStats(null);
  };

  clearWalls = () => {
    if (this.state.isAnimating) return;
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        if (node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
          return { ...node, isWall: false };
        }
        return node;
      })
    );
    this.setState({ grid: newGrid });
  };

  clearPath = () => {
    if (this.state.isAnimating) return;
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
          return { ...node, isVisited: false, isShortestPath: false, distance: Infinity, prevNode: null };
        }
        if (node.isTarget) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-target";
          return { ...node, isVisited: false, isShortestPath: false, distance: Infinity, prevNode: null };
        }
        if (node.isVisited || node.isShortestPath) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
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
    if (this.props.onStats) this.props.onStats(null);
  };

  animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {
    const speed = this.getAnimationSpeed();
    this.setState({ isAnimating: true });
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder.length);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isTarget) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, visitedCount) {
    if (nodesInShortestPathOrder.length === 1) {
      this.setState({ isAnimating: false });
      this.props.showToast("No path found! Target is unreachable.", "error");
      if (this.props.onStats) {
        this.props.onStats({ visited: visitedCount, pathLength: 0 });
      }
      return;
    }
    const speed = this.getAnimationSpeed();
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isTarget) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          this.setState({ isAnimating: false });
          this.props.showToast("Path found!", "success");
          if (this.props.onStats) {
            this.props.onStats({
              visited: visitedCount,
              pathLength: nodesInShortestPathOrder.length,
            });
          }
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

  visualizeAlgorithm(algorithm) {
    if (this.state.isAnimating) {
      this.props.showToast("Animation in progress, please wait.", "info");
      return;
    }
    const { startNode, targetNode } = this.state;
    if (!startNode || !targetNode) {
      this.props.showToast("Please select a start and end node first!", "error");
      return;
    }
    if (!algorithm) {
      this.props.showToast("Please select an algorithm first!", "error");
      return;
    }
    this.clearPath();
    setTimeout(() => {
      if (algorithm === "A_star") {
        this.visualizeAStar();
      } else if (algorithm === "Dijkstra's_Algorithm") {
        this.visualizeDijkstra();
      } else if (algorithm === "Breadth_first_Search") {
        this.visualizeBFS();
      } else if (algorithm === "Depth_first_Search") {
        this.visualizeDFS();
      }
    }, 50);
  }

  visualizePattern(pattern) {
    if (this.state.isAnimating) {
      this.props.showToast("Animation in progress, please wait.", "info");
      return;
    }
    if (!pattern) {
      this.props.showToast("Please select a maze pattern first!", "error");
      return;
    }
    if (pattern === "Prims_maze") {
      this.visualizePrimsMaze();
    }
  }

  animateMazeGeneration(maze) {
    const speed = this.getAnimationSpeed();
    this.setState({ isAnimating: true });
    const newGrid = this.state.grid.slice();
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[0].length; col++) {
        setTimeout(() => {
          const node = maze[row][col];
          const newNode = {
            ...node,
            isWall: node.isWall,
          };
          newGrid[row][col] = newNode;
          if (node.isWall) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-wall";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
          }
          if (row === maze.length - 1 && col === maze[0].length - 1) {
            this.setState({ grid: newGrid, isAnimating: false });
            this.props.showToast("Maze generated!", "success");
          }
        }, speed * (row * maze[0].length + col));
      }
    }
  }

  visualizePrimsMaze() {
    const { grid } = this.state;
    const maze = primsMaze(grid);
    this.animateMazeGeneration(maze);
  }

  visualizeBFS() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = bfs(grid, startNode, finishNode);
    const shortestPath = createPathBFS(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = dfs(grid, startNode, finishNode);
    const shortestPath = createPathDFS(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = dijkstra(grid, startNode, finishNode);
    const shortestPath = createPath(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  visualizeAStar() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.targetNode.row][this.state.targetNode.col];
    const visitedNodes = astar(grid, startNode, finishNode);
    const shortestPath = createPathAstar(finishNode);
    this.animateAlgo(visitedNodes, shortestPath);
  }

  handleSelectStartNode = () => {
    if (this.state.isAnimating) return;
    this.setState({ selectingStartNode: true, selectingEndNode: false });
    this.props.showToast("Click on the grid to place the start node", "info");
  };

  handleSelectEndNode = () => {
    if (this.state.isAnimating) return;
    this.setState({ selectingEndNode: true, selectingStartNode: false });
    this.props.showToast("Click on the grid to place the end node", "info");
  };

  render() {
    const { grid, selectingStartNode, selectingEndNode } = this.state;
    const selectionMode = selectingStartNode
      ? "selecting-start"
      : selectingEndNode
      ? "selecting-end"
      : "";
    return (
      <div className={`grid-container ${selectionMode}`}>
        <div className="controls">
          <button
            className={`btn btn-start-node ${selectingStartNode ? "active" : ""}`}
            onClick={this.handleSelectStartNode}
          >
            Place Start
          </button>
          <button
            className={`btn btn-end-node ${selectingEndNode ? "active" : ""}`}
            onClick={this.handleSelectEndNode}
          >
            Place End
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
