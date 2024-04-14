import React, { useState } from "react";
import "./Table.css";
import Cell from "./Cell"; // Cell 컴포넌트 임포트

function Table() {
  const size = 10;
  const rows = Array.from({ length: size }, (_, index) => index);
  const cols = rows;
  const [dragStart, setDragStart] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  const handleMouseDown = (row, col) => {
    setDragStart({ row, col });
    setHighlightedCells([{ row, col }]);
  };

  const handleMouseUp = (row, col) => {
    // 마우스를 뗐을 때 일직선 검사
    if (dragStart && (dragStart.row === row || dragStart.col === col)) {
      highlightCells(dragStart, { row, col });
    } else {
      setHighlightedCells([]); // 일직선이 아니면 강조 표시 제거
    }
    setDragStart(null); // 드래그 상태 초기화
  };

  const handleMouseOver = (row, col) => {
    if (dragStart) {
      if (dragStart.row === row || dragStart.col === col) {
        // 마우스가 일직선 상에 있을 때만 강조 표시
        highlightCells(dragStart, { row, col });
      }
    }
  };

  const highlightCells = (start, end) => {
    const newHighlighted = [];
    for (
      let i = Math.min(start.row, end.row);
      i <= Math.max(start.row, end.row);
      i++
    ) {
      for (
        let j = Math.min(start.col, end.col);
        j <= Math.max(start.col, end.col);
        j++
      ) {
        if (start.row === end.row || start.col === end.col) {
          newHighlighted.push({ row: i, col: j });
        }
      }
    }
    setHighlightedCells(newHighlighted);
  };

  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            {cols.map((col) => (
              <Cell
                key={col}
                row={row}
                col={col}
                isHighlighted={highlightedCells.some(
                  (cell) => cell.row === row && cell.col === col
                )}
                onMouseDown={handleMouseDown}
                onMouseOver={handleMouseOver}
                onMouseUp={handleMouseUp}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
