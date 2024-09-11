export function primsMaze(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const walls = [];
    const maze = grid.map(row => row.map(node => ({ ...node, isWall: true })));
  
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    maze[startRow][startCol].isWall = false;
  
    const directions = [
      { row: -1, col: 0 },  // Up
      { row: 1, col: 0 },   // Down
      { row: 0, col: -1 },  // Left
      { row: 0, col: 1 }    // Right
    ];
  
    function addWalls(row, col) {
      directions.forEach(direction => {
        const newRow = row + direction.row;
        const newCol = col + direction.col;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol].isWall) {
          walls.push({ row: newRow, col: newCol });
        }
      });
    }
  
    addWalls(startRow, startCol);
  
    while (walls.length > 0) {
      const randomIndex = Math.floor(Math.random() * walls.length);
      const { row, col } = walls.splice(randomIndex, 1)[0];
  
      const neighbors = directions
        .map(direction => ({ row: row + direction.row, col: col + direction.col }))
        .filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols && !maze[row][col].isWall);
  
      if (neighbors.length === 1) {
        maze[row][col].isWall = false;
        addWalls(row, col);
      }
    }
  
    return maze;
  }