class PriorityQueue {
    constructor() {
        this.arr = [];
    }

    push(element) {
        this.arr.push(element);
        let indx = this.arr.length - 1;
        while (indx > 0) {
            const parent = Math.floor((indx - 1) / 2);
            if (this.arr[indx].distance < this.arr[parent].distance) {
                [this.arr[indx], this.arr[parent]] = [this.arr[parent], this.arr[indx]];
                indx = parent;
            } else {
                break;
            }
        }
    }

    pop() {
        if (this.arr.length === 0) return null;
        if (this.arr.length === 1) return this.arr.pop();

        const topElement = this.arr[0];
        this.arr[0] = this.arr.pop(); // Replace root with the last element

        let indx = 0;

        while (true) {
            const left = 2 * indx + 1;
            const right = 2 * indx + 2;
            let smallest = indx;

            if (left < this.arr.length && this.arr[left].distance < this.arr[smallest].distance) {
                smallest = left;
            }
            if (right < this.arr.length && this.arr[right].distance < this.arr[smallest].distance) {
                smallest = right;
            }

            if (smallest === indx) break;

            [this.arr[indx], this.arr[smallest]] = [this.arr[smallest], this.arr[indx]];
            indx = smallest;
        }

        return topElement;
    }

    isEmpty() {
        return this.arr.length === 0; // Check the correct property
    }
}

export function dijkstra(grid, startingNode, targetNode) {
    const visitedNodes = [];
    const distances = {};
    const previousNodes = {};

    const pq = new PriorityQueue();

    // Initialize distances and previous nodes
    for (const row of grid) {
        for (const node of row) {
            distances[`${node.row}-${node.col}`] = Infinity;
            previousNodes[`${node.row}-${node.col}`] = null;
            node.previousNode = null ;
        }
    }

    distances[`${startingNode.row}-${startingNode.col}`] = 0; // Self distance is 0
    pq.push({ distance: 0, node: startingNode }); // Adding starting node to queue

    while (!pq.isEmpty()) {
        const { node: currNode } = pq.pop();

        if( currNode.isWall ) continue ;

        if (currNode === targetNode) {
            createPath(targetNode);
            return visitedNodes ;
        }

        visitedNodes.push(currNode); // Mark visited

        const neighbors = getNeighbors(currNode, grid);

        for (const neighbor of neighbors) {
            if (!visitedNodes.includes(neighbor)) {
                const newDistance = distances[`${currNode.row}-${currNode.col}`] + 1;
                if (newDistance < distances[`${neighbor.row}-${neighbor.col}`]) {
                    distances[`${neighbor.row}-${neighbor.col}`] = newDistance;
                    previousNodes[`${neighbor.row}-${neighbor.col}`] = currNode;
                    neighbor.previousNode = currNode ;
                    pq.push({ distance: newDistance, node: neighbor });
                }
            }
        }
    }
    return visitedNodes ;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;

    const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 },  // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }   // Right
    ];

    for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;

        // Check if the neighbor is within bounds and not a wall
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            const neighbor = grid[newRow][newCol];
            if (!neighbor.isWall) {
                neighbors.push(neighbor);
            }
        }
    }

    return neighbors;
}

export function createPath(targetNode) {
    const shortestPath = [];
    let currentNode = targetNode;
    while (currentNode) {
        currentNode.isShortestPath = true;
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
        // currentNode = previousNodes[`${currentNode.row}-${currentNode.col}`];
    }
    return shortestPath;
}