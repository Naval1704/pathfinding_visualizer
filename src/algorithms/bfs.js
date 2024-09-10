export function bfs(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [startNode];

    while (queue.length) {
        const currentNode = queue.shift();
        if (currentNode.isWall) continue;

        visitedNodesInOrder.push(currentNode);
        currentNode.isVisited = true;

        if (currentNode === endNode) {
            createPathBFS(endNode);
            return visitedNodesInOrder;
        }

        const { row, col } = currentNode;
        const neighbors = getNeighbors(grid, row, col);

        for (const neighbor of neighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) { 
                neighbor.previousNode = currentNode;
                neighbor.isVisited = true; 
                queue.push(neighbor);
            }
        }
       
    }

    return visitedNodesInOrder;
}

function getNeighbors(grid, row, col) {
    const neighbors = [];
    const numRows = grid.length;
    const numCols = grid[0].length;

    const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
    ];

    for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;

        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}

export function createPathBFS(targetNode) {
    const shortestPath = [];
    let currentNode = targetNode;
    while (currentNode) {
        currentNode.isShortestPath = true;
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
}