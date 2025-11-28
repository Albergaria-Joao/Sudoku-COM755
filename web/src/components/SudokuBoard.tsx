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

  // Usa uma matriz de estado para atualizar cada célula separadamente e conseguir colorir em vermelho
  const [validMatrix, setValidMatrix] = useState<boolean[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(true))
  );

  // Estado para a célula que está em foco agora
  const [focusedCell, setFocusedCell] = useState({ row: -1, col: -1, val: -1 });

  // Sempre que o tabuleiro for carregado (ex: acabou de gerar):
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
      // Se o tabuleiro foi resolvido, todas as células são válidas (para colorir em verde)
      setValidMatrix(
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(true))
      );
    }
  }, [solved]);

  // Cada novo valor será verificado com o C++
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


  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-black/20 rounded-lg shadow-xl">
        <div className="grid grid-cols-9">
          {board.map((row, i) => // Usa map nas rows e colunas (é como se fosse for dentro de for)
            row.map((cell, j) => ( // Em cada célula, terá esse componente SudokuCell com os seguintes props
              <SudokuCell
                key={`${i}-${j}`}
                value={cell} // Valor da célula
                i={i}
                j={j}
                valid={validMatrix[i][j]} // Se está valido
                editable={generatedBoard[i][j] === 0 && !solved} // Se é editável (isto é, não estava preenchido no tabuleiro original e não está resolvido)
                focusedCell={focusedCell} // A célula que está focada no momento (para saber se deve ficar em destaque se estiver na mesma linha, por ex)
                solved={solved}
                onFocus={() => setFocusedCell({ row: i, col: j, val: cell })} // Caso seja focada, muda o valor da focusedCell para ela mesma
                onBlur={() => setFocusedCell({ row: -1, col: -1, val: -1 })} // Se perder o foco, remove
                onChange={async (val) => {
                  const newBoard = board.map((r, ri) =>
                    ri === i ? r.map((c, ci) => (ci === j ? val : c)) : r
                  );
                  // Quando mudar, vai setar esse tabuleiro alterado como estado aqui e no componente pai para aparecer na interface
                  setBoard(newBoard);
                  setBoardState(newBoard);

                  const v = await onNewValue(i, j, val); // Vai verificar o valor

                  const newValidMatrix = validMatrix.map((r, ri) => // Atualiza a matriz de válidos nessa célula para o resultado da validação
                    ri === i ? r.map((c, ci) => (ci === j ? v : c)) : r
                  );

                  setFocusedCell({ row: i, col: j, val: cell }); // Coloca ela como focada 
                  setValidMatrix(newValidMatrix); // atualiza o estado da matriz de válidos

                  checkSolved(newValidMatrix, newBoard, i, j); // Checa se esse input já não resolveu o jogo
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

}
