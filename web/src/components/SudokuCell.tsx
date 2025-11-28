import { useState, useEffect } from "react";

type Props = {
  value: number;
  onChange: (val: number) => void;
  //disabled: boolean;
  valid: boolean;
  i: number;
  j: number;
  editable: boolean;
  focusedCell: { row: number; col: number; val: number };
  onFocus: () => void;
  onBlur: () => void;
  solved: boolean;
};

export default function SudokuCell({
  value,
  onChange,
  //disabled,
  valid,
  i,
  j,
  editable,
  focusedCell,
  onFocus,
  onBlur,
  solved,
}: Props) {
  useEffect(() => {
    //onGenGameClick();
    if (value > 9) {
      onChange(9);
    }
  }, [value]);

  //console.log("Focused cell:", focusedCell);
  const isHighlighted =
    focusedCell.row !== null &&
    (focusedCell.row === i || // mesma linha
      focusedCell.col === j || // mesma coluna
      (Math.floor(focusedCell.row / 3) === Math.floor(i / 3) &&
        Math.floor(focusedCell.col / 3) === Math.floor(j / 3))); // mesmo bloco 3x3
  const isSameValue = focusedCell.val > 0 && focusedCell.val === value;

  //let bgClass = "";

return (
  <input
    type="number"
    min="1"
    max="9"
    value={value || ""}
    disabled={!editable}
    onChange={(e) => onChange(Number(e.target.value) || 0)}
    onFocus={onFocus}
    onBlur={onBlur}
    className={`
      /* --- Se inválido --- */
      ${
        valid
          ? "text-white"
          : "text-red-400 bg-red-900/40 border-red-500 focus:bg-red-900/40"
      }

      /* --- SUA lógica tem prioridade absoluta agora --- */
      ${solved ? "bg-green-600" : ""}

      /* Só aplica destaque se NÃO tiver bgClass (ex: verde do solved) */
      ${!solved &&
        focusedCell.row === i &&
        focusedCell.col === j
        ? "bg-blue-600 text-white scale-[1.06] shadow-lg shadow-blue-500/40 relative z-10"
        : ""
      }

      ${!solved &&
        focusedCell.row === i &&
        !(focusedCell.col === j)
        ? "bg-blue-900/40"
        : ""
      }

      ${!solved &&
        focusedCell.col === j &&
        !(focusedCell.row === i)
        ? "bg-blue-900/40"
        : ""
      }

      ${!solved &&
        Math.floor(focusedCell.row / 3) === Math.floor(i / 3) &&
        Math.floor(focusedCell.col / 3) === Math.floor(j / 3) &&
        !(focusedCell.row === i && focusedCell.col === j)
        ? "bg-blue-900/20"
        : ""
      }

      /* --- Células fixas mais fortes --- */
      ${
        !editable && !solved
          ? "bg-neutral-700 text-gray-200 font-extrabold shadow-inner shadow-black/60"
          : ""
      }

      /* --- Dark mode base --- */
      ${!solved ? "bg-neutral-900" : ""}

      w-12 h-12 
      text-center
      border border-neutral-700
      focus:outline-none
      text-lg
      rounded-sm
      transition-all duration-100

      [-moz-appearance:_textfield]
      [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none

      ${editable ? "cursor-pointer" : "cursor-default"}

      /* --- BORDAS GROSSAS DO BLOCO 3x3 --- */
      ${i % 3 === 0 ? "border-t-4 border-t-neutral-400" : ""}
      ${j % 3 === 0 ? "border-l-4 border-l-neutral-400" : ""}
      ${i === 8 ? "border-b-4 border-b-neutral-400" : ""}
      ${j === 8 ? "border-r-4 border-r-neutral-400" : ""}
    `}
  />
);




}

// focus:ring-2 focus:ring-blue-500
