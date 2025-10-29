async function resolver(props: { board: number[][] }) {
  const res = await fetch("http://localhost:5000/resolver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabuleiro: props.board }),
  });
  const data = await res.json();
  alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
}

function SolveButton() {
  return <button>Resolver tabuleiro com algoritmo</button>;
}

export default SolveButton;
