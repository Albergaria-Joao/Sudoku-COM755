async function gerar() {
  const res = await fetch("http://localhost:5000/gerar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data["tabuleiro"];
  //alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
}

function GenButton({ onGenGameClick }: { onGenGameClick: () => void }) {
  return <button onClick={() => onGenGameClick()}>Gerar novo tabuleiro</button>;
}

export default GenButton;
