import Button from "./Button";

function SolveButton({ onSolveClick }: { onSolveClick: () => void }) {
  return (
    <div className="align-middle">
      <Button onClick={() => onSolveClick()}>
        Resolver tabuleiro com algoritmo
      </Button>
      <p className="text-red-600">(Não contará mais para o leaderboard)</p>
    </div>
  );
}

export default SolveButton;
