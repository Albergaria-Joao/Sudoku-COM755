function GenButton({ onGenGameClick }: { onGenGameClick: () => void }) {
  return <button onClick={() => onGenGameClick()}>Gerar novo tabuleiro</button>;
}

export default GenButton;
