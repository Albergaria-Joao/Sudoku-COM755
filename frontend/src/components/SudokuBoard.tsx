import { useState, useEffect } from "react";
import SudokuCell from "./SudokuCell";

export default function SudokuBoard({ tab }) {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );

  useEffect(() => {
    if (!tab) return;
    setBoard(tab);
    console.log("Tabuleiro mudou");
  }, [tab]);

  async function verificar() {
    const res = await fetch("http://localhost:5000/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: board }),
    });
    const data = await res.json();
    alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <SudokuCell
              key={`${i}-${j}`}
              value={cell}
              //disabled={cell !== 0}
              onChange={(val) => {
                const newBoard = board.map((r, ri) =>
                  ri === i ? r.map((c, ci) => (ci === j ? val : c)) : r
                );
                setBoard(newBoard);
              }}
            />
          ))
        )}
      </div>

      <button
        onClick={verificar}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Verificar Sudoku
      </button>
    </div>
  );
}
