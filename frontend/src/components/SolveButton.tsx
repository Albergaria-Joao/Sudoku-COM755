function SolveButton({ onSolveClick }: { onSolveClick: () => void }) {
  return (
    <button onClick={() => onSolveClick()}>
      Resolver tabuleiro com algoritmo
    </button>
  );
}

export default SolveButton;
