import { useState, useEffect } from "react";
import SudokuCell from "./SudokuCell";

export default function SudokuBoard({
  tab,
  generatedBoard,
  onNewValue,
  solved,
}: {
  tab: number[][];
  generatedBoard: number[][];
  onNewValue: (r: number, c: number, num: number) => Promise<boolean>;
  solved: boolean;
}) {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );

  // Usa uma matriz de estado para atualizar cada célula separada
  const [validMatrix, setValidMatrix] = useState<boolean[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(true))
  );

  useEffect(() => {
    if (!tab) return;
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
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-9 gap-0.1">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <SudokuCell
              key={`${i}-${j}`}
              value={cell}
              //disabled={false}
              i={i}
              j={j}
              onChange={async (val) => {
                // Função usada para atualizar o valor da variável tabuleiro (para cada célula, verifica se houvee uma mudança)
                const newBoard = board.map(
                  (
                    r,
                    ri // ri = row index
                  ) => (ri === i ? r.map((c, ci) => (ci === j ? val : c)) : r) // Se a célula pela qual está passando é a atual, atualiza seu valor no tabuleiro
                );
                setBoard(newBoard);
                const v = await onNewValue(i, j, val);
                // Atualiza apenas a célula que foi modificada
                const newValidMatrix = validMatrix.map((r, ri) =>
                  ri === i ? r.map((c, ci) => (ci === j ? v : c)) : r
                );
                setValidMatrix(newValidMatrix);
              }}
              valid={validMatrix[i][j]}
              editable={generatedBoard[i][j] === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
