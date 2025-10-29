import { useState, useEffect } from "react";

type Props = {
  value: number;
  onChange: (val: number) => void;
};

export default function SudokuCell({
  value,
  onChange,
  disabled,
  valid,
}: Props) {
  const [incorrect, setIncorrect] = useState<boolean>(false);

  useEffect(() => {
    console.log("VALOR ALTERADO");
  }, [valid]);

  return (
    <input
      type="number"
      min="1"
      max="9"
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`${
        incorrect && "text-red-500"
      } w-10 h-10 text-center border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  );
}
