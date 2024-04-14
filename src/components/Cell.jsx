import React from "react";
import "./Cell.css"; // 셀 전용 CSS

function Cell({
  row,
  col,
  isHighlighted,
  onMouseDown,
  onMouseOver,
  onMouseUp,
}) {
  return (
    <td
      className={isHighlighted ? "highlighted" : ""}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseOver={() => onMouseOver(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    ></td>
  );
}

export default Cell;
