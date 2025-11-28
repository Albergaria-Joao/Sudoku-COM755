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
    console.log(solved);
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

const getBgClass = () => {
  if (solved) return "bg-green-600 text-gray-200 font-extrabold shadow-inner shadow-black/60";
  if (focusedCell.row === i && focusedCell.col === j)
    return "bg-blue-600";
  if (isSameValue && isHighlighted) return "bg-yellow-500";
  if (!editable && isHighlighted) return "bg-blue-900 text-gray-200 font-extrabold shadow-inner shadow-black/60";
  if (!editable) return "bg-neutral-700 text-gray-200 font-extrabold shadow-inner shadow-black/60";
  if (isHighlighted) return "bg-blue-900/40";

  // fallback dark mode
  return "bg-neutral-900";
};

return (
  <input
    type="number"
    min="1"
    max="9"
    value={value > 0 && value < 10 ? value : ""}
    disabled={!editable}
    onChange={(e) => onChange(Number(e.target.value) || 0)}
    onFocus={onFocus}
    onBlur={onBlur}
    className={`
      text-3xl
      ${valid
        ? "text-white"
        : "text-red-400 bg-red-900/40 border-red-500 focus:bg-red-900/40"
      }

      ${getBgClass()}

      ${focusedCell.row === i && focusedCell.col === j
        ? "!text-white scale-[1.1] shadow-lg shadow-blue-500/30 relative z-10"
        : ""
      }

      w-14 h-14
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

      ${i % 3 === 0 ? "border-t-4 border-t-neutral-400" : ""}
      ${j % 3 === 0 ? "border-l-4 border-l-neutral-400" : ""}
      ${i === 8 ? "border-b-4 border-b-neutral-400" : ""}
      ${j === 8 ? "border-r-4 border-r-neutral-400" : ""}
    `}
  />
);




}

// focus:ring-2 focus:ring-blue-500
