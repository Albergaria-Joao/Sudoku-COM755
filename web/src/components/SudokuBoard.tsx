import { useState, useEffect } from "react";
import SudokuCell from "./SudokuCell";

export default function SudokuBoard({
  tab,
  generatedBoard,
  solved,
  setBoardState,
  checkSolved,
}: {
  tab: number[][];
  generatedBoard: number[][];
  solved: boolean;
  setBoardState: (newBoard: number[][]) => void;
  checkSolved: (
    validMatrix: boolean[][],
    board: number[][],
    i: number,
    j: number
  ) => void;
}) {
  const api = "http://localhost:5000";

  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );

  // Usa uma matriz de estado para atualizar cada célula separada
  const [validMatrix, setValidMatrix] = useState<boolean[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(true))
  );

  const [focusedCell, setFocusedCell] = useState({ row: -1, col: -1, val: -1 });

  useEffect(() => {
    if (!tab) return;
    if (tab === generatedBoard) {
      setValidMatrix(
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(true))
      );
    }
    setBoard(tab);
    console.log("Tabuleiro mudou");
  }, [tab]);

  useEffect(() => {
    if (solved) {
      // Se o tabuleiro foi resolvido, todas as células são válidas
      setValidMatrix(
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(true))
      );
    }
  }, [solved]);

  async function onNewValue(
    r: number,
    c: number,
    num: number
  ): Promise<boolean> {
    const res = await fetch(`${api}/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: board, r: r, c: c, num: num }),
    });
    const data = await res.json();
    //console.log(data["valido"]);
    if (data["valido"] == true) {
      return true;
    }

    return false;
  }

  // async function verificar() {
  //   const res = await fetch("http://localhost:5000/verificar", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ tabuleiro: board }),
  //   });
  //   const data = await res.json();
  //   alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
  // }

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-black/20 rounded-lg shadow-xl">
        <div className="grid grid-cols-9">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <SudokuCell
                key={`${i}-${j}`}
                value={cell}
                i={i}
                j={j}
                valid={validMatrix[i][j]}
                editable={generatedBoard[i][j] === 0 && !solved}
                focusedCell={focusedCell}
                solved={solved}
                onFocus={() => setFocusedCell({ row: i, col: j, val: cell })}
                onBlur={() => setFocusedCell({ row: -1, col: -1, val: -1 })}
                onChange={async (val) => {
                  const newBoard = board.map((r, ri) =>
                    ri === i ? r.map((c, ci) => (ci === j ? val : c)) : r
                  );

                  setBoard(newBoard);
                  setBoardState(newBoard);

                  const v = await onNewValue(i, j, val);

                  const newValidMatrix = validMatrix.map((r, ri) =>
                    ri === i ? r.map((c, ci) => (ci === j ? v : c)) : r
                  );

                  setFocusedCell({ row: i, col: j, val: cell });
                  setValidMatrix(newValidMatrix);

                  checkSolved(newValidMatrix, newBoard, i, j);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

}
