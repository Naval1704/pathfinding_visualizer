import React, { Component } from "react";
import "./styles/grid.css";
import Node from "./node";

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      startNode: null,
      targetNode: null,
    };
  }

  componentDidMount() {
    let rows = Math.floor(window.innerHeight / 35);
    let cols = Math.floor(window.innerWidth / 37);
    const nodes = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: false,
          isTarget: false,
        });
      }
      nodes.push(currentRow);
    }
    this.setState({ nodes });
  }

  handleNodeClick(row, col) {
    const { nodes, startNode, targetNode } = this.state;
    const newNodes = nodes.slice();
    const node = newNodes[row][col];

    if (!startNode) {
      node.isStart = true;
      this.setState({ nodes: newNodes, startNode: node });
    } else if (!targetNode) {
      node.isTarget = true;
      this.setState({ nodes: newNodes, targetNode: node });
    }
  }

  render() {
    const { nodes } = this.state;
    const { algorithm, pattern, speed } = this.props;

    return (
      <div className="grid">
        {nodes.map((row, rowIndx) => (
          <div key={rowIndx} className="row">
            {row.map((node, nodeIndx) => (
              <Node
                key={nodeIndx}
                isStart={node.isStart}
                isTarget={node.isTarget}
                onClick={() => this.handleNodeClick(node.row, node.col)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}