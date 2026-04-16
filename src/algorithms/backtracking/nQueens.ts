import { DPSnapshot } from "@/types/algorithm";

const CODE = `function solveNQueens(n) {
  const board = Array.from({ length: n }, () => new Array(n).fill(0));
  const results = [];

  function isSafe(row, col) {
    for (let i = 0; i < row; i++)
      if (board[i][col]) return false;
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
      if (board[i][j]) return false;
    for (let i = row, j = col; i >= 0 && j < n; i--, j++)
      if (board[i][j]) return false;
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      results.push(board.map(r => [...r]));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 1;
        backtrack(row + 1);
        board[row][col] = 0;
      }
    }
  }

  backtrack(0);
  return results;
}`;

export function generateNQueensSnapshots(input: { n: number }): DPSnapshot[] {
  const { n } = input;
  const snapshots: DPSnapshot[] = [];
  const board: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  function isSafe(row: number, col: number) {
    // Check column
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
    }
    // Check upper left diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
    }
    // Check upper right diagonal
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 1) return false;
    }
    return true;
  }

  function backtrack(row: number) {
    if (row === n) {
      snapshots.push({
        table: board.map(r => [...r]),
        i: row - 1,
        w: -1,
        action: "done",
        message: "Found a valid placement for all queens!",
        codeLine: 20,
      });
      return true; // Stop after first solution for visualization clarity
    }

    for (let col = 0; col < n; col++) {
      snapshots.push({
        table: board.map(r => [...r]),
        i: row,
        w: col,
        action: "init",
        message: `Trying to place queen at row ${row}, column ${col}...`,
        codeLine: 24,
      });

      if (isSafe(row, col)) {
        board[row][col] = 1;
        snapshots.push({
          table: board.map(r => [...r]),
          i: row,
          w: col,
          action: "include",
          message: `Position (${row}, ${col}) is safe. Placing queen.`,
          codeLine: 26,
        });

        if (backtrack(row + 1)) return true;

        board[row][col] = 0;
        snapshots.push({
          table: board.map(r => [...r]),
          i: row,
          w: col,
          action: "exclude",
          message: `Backtracking: Removing queen from (${row}, ${col}).`,
          codeLine: 28,
        });
      } else {
        snapshots.push({
          table: board.map(r => [...r]),
          i: row,
          w: col,
          action: "exclude",
          message: `Position (${row}, ${col}) is under attack!`,
          codeLine: 24,
        });
      }
    }
    return false;
  }

  backtrack(0);

  return snapshots;
}

export const nQueensMeta = {
  id: "n-queens",
  name: "N-Queens",
  category: "backtracking" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(N!)",
  spaceComplexity: "O(N²)",
  description: "The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.",
  analogy: "Like trying to seat N people in a room where everyone hates everyone else in their row, column, or diagonal.",
  approach: [
    "Start in the leftmost column",
    "If all queens are placed, return true",
    "Try all rows in current column",
    "Check if queen can be placed safely",
    "If yes, place queen and recur",
    "If placing lead to a solution, return true",
    "If not, backtrack and try other rows"
  ],
  pseudocode: `solve(row):
  if row == n: return true
  for col in 0..n-1:
    if isSafe(row, col):
      placeQueen(row, col)
      if solve(row + 1): return true
      removeQueen(row, col)
  return false`,
  cppCode: `bool solve(vector<vector<int>>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1;
            if (solve(board, row + 1, n)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}`,
  javaCode: `boolean solve(int[][] board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1;
            if (solve(board, row + 1, n)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}`,
  code: CODE,
  defaultInput: { n: 4 },
};
