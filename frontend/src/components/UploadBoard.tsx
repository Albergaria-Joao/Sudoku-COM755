import { useState } from "react";

type UploadBoardProps = {
  onUpload: (file: File) => void;
};

function UploadBoard({ onUpload }: UploadBoardProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    } else {
      alert("Selecione um arquivo primeiro!");
    }
  };

  return (
    <div>
      <h2>Enviar arquivo</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
    </div>
  );
}

export default UploadBoard;
