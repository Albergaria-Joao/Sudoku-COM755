import Button from "./Button";

function SolveButton({ onSolveClick }: { onSolveClick: () => void }) {
  return (
    <Button onClick={() => onSolveClick()}>
      Resolver tabuleiro com algoritmo
    </Button>
  );
}

export default SolveButton;
