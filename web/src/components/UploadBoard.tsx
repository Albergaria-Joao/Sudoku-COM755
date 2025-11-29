import { useState } from "react";
import Button from "./Button";

type UploadBoardProps = {
  onUpload: (file: File) => void;
};

function UploadBoard({ onUpload }: UploadBoardProps) {
  const [file, setFile] = useState<File | null>(null);

  // Seta o estado File para o arquivo que foi feito o upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file); // Usa a função passada do componente pai
    } else {
      alert("Selecione um arquivo primeiro!");
    }
  };

  return (
  <div className="bg-gray-800 p-4 rounded-lg mt-6 border border-gray-700">
    <h2 className="text-lg font-semibold mb-2">Ou, enviar jogo em arquivo CSV</h2>
    <input
      type="file"
      accept=".csv"
      onChange={handleFileChange}
      className="block mb-3"
    />
    <Button
      onClick={handleUpload}
    >
      Enviar
    </Button>
  </div>
);

}

export default UploadBoard;
