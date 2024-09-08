export function dfs(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const stack = [startNode]; // Stack instead of queue

    while (stack.length) {
        const currentNode = stack.pop();
        if (currentNode.isWall) continue; // Skip walls
        if (currentNode.isVisited) continue; // Skip visited nodes

        visitedNodesInOrder.push(currentNode);
        currentNode.isVisited = true;

        if (currentNode === endNode) {
            createPathDFS(endNode); // Similar to BFS, create the path
            return visitedNodesInOrder;
        }

        const { row, col } = currentNode;
        const neighbors = getNeighbors(grid, row, col);

        // Push neighbors to the stack, but in reverse order so the first neighbor
        // is processed first (maintains the "depth" behavior of DFS)
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder; // Return nodes visited during DFS
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

export function createPathDFS(targetNode) {
    const shortestPath = [];
    let currentNode = targetNode;
    while (currentNode) {
        currentNode.isShortestPath = true;
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
}
