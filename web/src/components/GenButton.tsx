import Button from "./Button";

function GenButton({ onGenGameClick }: { onGenGameClick: () => void }) {
  return (
    <div>
      <h1>Dificuldade: </h1>
      <select id="select_dif" name="mySelectName">
        <option value={0}>Fácil</option>
        <option value={1}>Médio</option>
        <option value={2}>Difícil</option>
      </select>
      <Button onClick={() => onGenGameClick()}>Gerar novo tabuleiro</Button>
    </div>
  );
}

export default GenButton;
