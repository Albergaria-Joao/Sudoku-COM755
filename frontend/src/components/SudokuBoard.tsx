/*
SudokuBoard.tsx
React + TypeScript component (single-file) for a 9x9 Sudoku board styled with TailwindCSS.

How to use:
1. Put this file in `src/components/SudokuBoard.tsx` of a Vite + React + TS project.
2. Make sure Tailwind is configured and `src/index.css` (or similar) imports:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
3. Import and render in `App.tsx`:
   import SudokuBoard from './components/SudokuBoard';
   export default function App(){ return <div className="p-4"><SudokuBoard/></div> }

Features included:
- 9x9 grid rendering with 3x3 block borders
- sample puzzle (you can replace with your generator)
- cell selection with keyboard input (1-9, Backspace/Delete to clear)
- highlights for selected row/column/box
- small on-screen number pad (useful on touch devices)
- simple immutability-friendly state updates

Possible enhancements you can ask me for:
- Sudoku generator (difficulty levels)
- Solver (backtracking) + "hint" button
- Pencil/memo notes for each cell
- Validation/highlight conflicts
- Saving/loading puzzles to localStorage

*/

import React, { useEffect, useState, useCallback } from "react";

type Cell = number | null; // 1-9 or null

type Board = Cell[]; // length 81

const IDX = (r: number, c: number) => r * 9 + c;

const samplePuzzle: Board = [
  5,
  3,
  null,
  null,
  7,
  null,
  null,
  null,
  null,
  6,
  null,
  null,
  1,
  9,
  5,
  null,
  null,
  null,
  null,
  9,
  8,
  null,
  null,
  null,
  null,
  6,
  null,

  8,
  null,
  null,
  null,
  6,
  null,
  null,
  null,
  3,
  4,
  null,
  null,
  8,
  null,
  3,
  null,
  null,
  1,
  7,
  null,
  null,
  null,
  2,
  null,
  null,
  null,
  6,

  null,
  6,
  null,
  null,
  null,
  null,
  2,
  8,
  null,
  null,
  null,
  null,
  4,
  1,
  9,
  null,
  null,
  5,
  null,
  null,
  null,
  null,
  8,
  null,
  null,
  7,
  9,
];

function generateEmptyBoard(): Board {
  return new Array(81).fill(null);
}

function withinSameBox(aRow: number, aCol: number, bRow: number, bCol: number) {
  return (
    Math.floor(aRow / 3) === Math.floor(bRow / 3) &&
    Math.floor(aCol / 3) === Math.floor(bCol / 3)
  );
}

export default function SudokuBoard() {
  const [board, setBoard] = useState<Board>(() => samplePuzzle.slice());
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(
    null
  );
  const [givenMask] = useState<boolean[]>(() => board.map((v) => v !== null));

  // helper to update a single cell
  const setCell = useCallback(
    (r: number, c: number, value: Cell) => {
      const idx = IDX(r, c);
      // don't allow changing givens
      if (givenMask[idx]) return;
      setBoard((prev) => {
        const copy = prev.slice();
        copy[idx] = value;
        return copy;
      });
    },
    [givenMask]
  );

  // keyboard handling
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!selected) return;
      const { r, c } = selected;
      if (e.key >= "1" && e.key <= "9") {
        const v = Number(e.key);
        setCell(r, c, v);
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        setCell(r, c, null);
      } else if (e.key === "ArrowUp") {
        setSelected((prev) =>
          prev ? { r: (prev.r + 8) % 9, c: prev.c } : prev
        );
      } else if (e.key === "ArrowDown") {
        setSelected((prev) =>
          prev ? { r: (prev.r + 1) % 9, c: prev.c } : prev
        );
      } else if (e.key === "ArrowLeft") {
        setSelected((prev) =>
          prev ? { r: prev.r, c: (prev.c + 8) % 9 } : prev
        );
      } else if (e.key === "ArrowRight") {
        setSelected((prev) =>
          prev ? { r: prev.r, c: (prev.c + 1) % 9 } : prev
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setCell]);

  // helper to check conflicts (simple)
  const isConflict = (r: number, c: number, v: number | null) => {
    if (v === null) return false;
    // row
    for (let cc = 0; cc < 9; cc++) {
      if (cc === c) continue;
      const val = board[IDX(r, cc)];
      if (val === v) return true;
    }
    // col
    for (let rr = 0; rr < 9; rr++) {
      if (rr === r) continue;
      const val = board[IDX(rr, c)];
      if (val === v) return true;
    }
    // box
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let rr = br; rr < br + 3; rr++) {
      for (let cc = bc; cc < bc + 3; cc++) {
        if (rr === r && cc === c) continue;
        const val = board[IDX(rr, cc)];
        if (val === v) return true;
      }
    }
    return false;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <div className="grid grid-cols-9 gap-0 select-none">
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 9 }).map((__, c) => {
              const idx = IDX(r, c);
              const val = board[idx];
              const isGiven = givenMask[idx];
              const sel = selected && selected.r === r && selected.c === c;
              const highlight =
                selected &&
                (selected.r === r ||
                  selected.c === c ||
                  withinSameBox(selected.r, selected.c, r, c));
              const conflict = typeof val === "number" && isConflict(r, c, val);

              // border thickness for 3x3 blocks
              const top = r % 3 === 0 ? "border-t-2" : "border-t";
              const left = c % 3 === 0 ? "border-l-2" : "border-l";
              const right = c === 8 ? "border-r-2" : "";
              const bottom = r === 8 ? "border-b-2" : "";

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setSelected({ r, c })}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-lg
                    border border-gray-300 ${top} ${left} ${right} ${bottom} focus:outline-none
                    ${
                      sel
                        ? "bg-blue-100"
                        : highlight
                        ? "bg-blue-50"
                        : "bg-white"
                    }
                    ${isGiven ? "font-semibold" : "font-medium"}
                    ${conflict ? "text-red-600" : "text-gray-900"}`}
                >
                  {val ?? ""}
                </button>
              );
            })
          )}
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => setBoard(generateEmptyBoard())}
              className="px-3 py-1 rounded-lg border hover:bg-gray-50"
            >
              Limpar
            </button>
            <button
              onClick={() => setBoard(samplePuzzle.slice())}
              className="ml-2 px-3 py-1 rounded-lg border hover:bg-gray-50"
            >
              Sample
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Use teclado (1-9) ou clique em um número abaixo
          </div>
        </div>

        {/* number pad */}
        <div className="mt-3 grid grid-cols-9 gap-2 sm:gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!selected) return;
                setCell(selected.r, selected.c, i + 1);
              }}
              className="col-span-1 py-1 rounded-md border hover:bg-gray-50"
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => {
              if (!selected) return;
              setCell(selected.r, selected.c, null);
            }}
            className="col-span-3 py-1 rounded-md border hover:bg-gray-50"
          >
            Apagar
          </button>
        </div>
      </div>

      {/* small footer */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Sudoku board — React + TS + Tailwind (componente standalone)
      </div>
    </div>
  );
}
