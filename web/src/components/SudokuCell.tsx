import { useState, useEffect } from "react";

type Props = {
  value: number;
  onChange: (val: number) => void;
  //disabled: boolean;
  valid: boolean;
  i: number;
  j: number;
};

export default function SudokuCell({
  value,
  onChange,
  //disabled,
  valid,
  i,
  j,
}: Props) {
  useEffect(() => {
    //onGenGameClick();
    if (value > 9) {
      onChange(9);
    }
  }, [value]);
  return (
    <input
      type="number"
      min="1"
      max="9"
      value={value || ""}
      //disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`${
        valid ? "text-black" : "text-red-500 focus:ring-red-500 bg-red-200"
      } w-11 h-11 text-center border border-gray-400 focus:outline-none focus:bg-blue-200
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
