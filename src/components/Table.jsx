import React, { useState, useEffect } from "react";
import "./Table.css";

function Table() {
  const size = 10;
  const [dragStart, setDragStart] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 현재 플레이어 번호 추가

  useEffect(() => {
    const newCells = Array(size)
      .fill(null)
      .map(() => Array(size).fill({ char: "", owner: 0 })); // owner를 -1로 초기화
    const koreanCharacters = "가나다라마바사아자차카타파하";
    let positions = new Set();

    while (positions.size < 3) {
      positions.add(Math.floor(Math.random() * size * size));
    }

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

  const handleMouseUp = () => {
    if (dragStart) {
      highlightCells(dragStart, highlightedCells[highlightedCells.length - 1]);
      handleCellInput();
    }
    setHighlightedCells([]);
    setDragStart(null);
    changePlayer(); // 플레이어 변경
  };

  const handleMouseOver = (row, col) => {
    if (dragStart) {
      if (dragStart.row === row || dragStart.col === col) {
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

  const handleCellInput = () => {
    const inputValue = window.prompt("Enter character:");
    if (inputValue !== null) {
      setCells((prevCells) => {
        const newCells = [...prevCells];
        let validInput = true; // 입력이 유효한지 확인하는 변수 추가

        highlightedCells.forEach((cell, index) => {
          // 기존 문자와 새 문자가 다르면 유효하지 않은 입력으로 처리
          if (
            newCells[cell.row][cell.col].char !== "" &&
            newCells[cell.row][cell.col].char !== inputValue[index]
          ) {
            validInput = false;
          }
        });

        // 유효하지 않은 입력일 때 처리
        if (!validInput) {
          alert(
            "잘못된 입력입니다. 입력된 문자가 이미 존재하는 문자와 다릅니다."
          );
          return prevCells; // 변경사항 취소하고 이전 상태 유지
        }

        // 유효한 입력인 경우에만 셀의 내용을 업데이트
        highlightedCells.forEach((cell, index) => {
          if (newCells[cell.row][cell.col].owner !== -1) {
            // owner가 -1이 아닌 경우에만 변경
            newCells[cell.row][cell.col] = {
              ...newCells[cell.row][cell.col],
              char: inputValue[index],
              owner: currentPlayer, // 현재 플레이어의 소유로 변경
            };
          }
        });

        return newCells; // 변경된 상태 반환
      });
    }
  };

  const changePlayer = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
  };

  return (
    <div>
      <div>현재 플레이어: {currentPlayer}</div>
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
                      : cell.owner === 1
                      ? "player1"
                      : cell.owner === 2
                      ? "player2"
                      : highlightedCells.some(
                          (cell) =>
                            cell.row === rowIndex && cell.col === colIndex
                        )
                      ? "highlighted"
                      : ""
                  } // owner에 따라 클래스를 동적으로 설정
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
    </div>
  );
}

export default Table;
