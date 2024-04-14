import React, { useState, useEffect } from "react";
import "./Table.css";

function Table() {
  const size = 10;
  const [dragStart, setDragStart] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  // 각 셀의 정보를 포함하는 상태 초기화
  const [cells, setCells] = useState([]);

  // 무작위 위치에 한글 문자 배치 및 owner 설정
  useEffect(() => {
    const newCells = Array(size)
      .fill(null)
      .map(() => Array(size).fill({ char: "", owner: 0 }));
    const koreanCharacters = "가나다라마바사아자차카타파하"; // 사용할 한글 문자
    let positions = new Set(); // 중복을 피하기 위해 Set 사용

    // 3개의 고유 위치를 생성
    while (positions.size < 3) {
      positions.add(Math.floor(Math.random() * size * size));
    }

    // Set에 저장된 위치를 사용하여 셀에 문자 배치
    positions.forEach((pos) => {
      const row = Math.floor(pos / size);
      const col = pos % size;
      newCells[row][col] = {
        char: koreanCharacters.charAt(
          Math.floor(Math.random() * koreanCharacters.length)
        ),
        owner: -1,
      };
    });

    setCells(newCells);
  }, []);

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
        {cells.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                row={rowIndex}
                col={colIndex}
                className={
                  cell.owner === -1
                    ? "special"
                    : highlightedCells.some(
                        (cell) => cell.row === rowIndex && cell.col === colIndex
                      )
                    ? "highlighted"
                    : ""
                }
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
              >
                {cell.char}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
