import Button from "./Button";

function LoadButton({ onLoadClick }: { onLoadClick: () => Promise<void> }) {
  return <Button onClick={() => onLoadClick()}>Carregar</Button>;
}

export default LoadButton;
