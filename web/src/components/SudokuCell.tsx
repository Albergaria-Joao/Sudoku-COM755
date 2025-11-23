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

  let bgClass = "";

  if (!valid) {
    bgClass = "bg-red-200";
  } else if (isSameValue && isHighlighted) {
    bgClass = "bg-yellow-200";
  } else if (!editable && isHighlighted) {
    bgClass = "bg-blue-100";
  } else if (isHighlighted) {
    bgClass = "bg-blue-200";
  } else if (!editable) {
    bgClass = "bg-gray-300";
  } else {
    bgClass = "bg-white";
  }

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
        ${
          valid
            ? "text-black"
            : "text-red-500 focus:ring-red-500 bg-red-200 focus:bg-red-200"
        } 
        ${bgClass}
        ${editable ? "cursor-pointer" : "cursor-default  font-bold disabled"}
        
        
      w-11 h-11 text-center border border-gray-400 focus:outline-none focus:bg-blue-300
      [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none
      ${i % 3 === 0 ? "border-t-4 border-t-black" : ""}
      ${j % 3 === 0 ? "border-l-4 border-l-black" : ""}
      ${i === 8 ? "border-b-4 border-b-black" : ""}
      ${j === 8 ? "border-r-4 border-r-black" : ""}
`}
    />
  );
}

// focus:ring-2 focus:ring-blue-500
