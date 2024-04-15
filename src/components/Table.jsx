import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";

const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;

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

  const handleMouseDown = (row, col, owner) => {
    setDragStart({ row, col, owner });
    setHighlightedCells([{ row, col, owner }]);
  };

  const handleMouseUp = () => {
    if (dragStart) {
      highlightCells(dragStart, highlightedCells[highlightedCells.length - 1]);
      const set = new Set();
      highlightedCells.forEach((cell) => {
        set.add(cell.owner);
      });
      var isValid = true;
      if (!set.has(-1) && !set.has(currentPlayer)) isValid = false;
      else if (set.size === 1) isValid = false;
      else {
        set.delete(-1);
        set.delete(0);
        set.delete(currentPlayer);
        if (set.size > 0) isValid = false;
      }
      if (isValid) handleCellInput();
    }
    setHighlightedCells([]);
    setDragStart(null);
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
    const startRow = start.row;
    const endRow = end.row;
    const startCol = start.col;
    const endCol = end.col;
    const rowIncrement = startRow <= endRow ? 1 : -1;
    const colIncrement = startCol <= endCol ? 1 : -1;

    for (let i = startRow; i !== endRow + rowIncrement; i += rowIncrement) {
      for (let j = startCol; j !== endCol + colIncrement; j += colIncrement) {
        newHighlighted.push({ row: i, col: j, owner: cells[i][j].owner });
      }
    }

    setHighlightedCells(newHighlighted);
  };

  const handleCellInput = async () => {
    const inputValue = window.prompt("Enter character:");
    if (inputValue !== null) {
      // 입력이 유효한지 먼저 확인
      if (inputValue.length !== highlightedCells.length) {
        alert("글자 길이가 다릅니다.");
        return;
      }

      // 입력된 문자가 기존의 문자와 동일한지 확인
      let validInput = true;
      highlightedCells.forEach((cell, index) => {
        if (
          cells[cell.row][cell.col].char !== "" &&
          cells[cell.row][cell.col].char !== inputValue.charAt(index)
        ) {
          validInput = false;
        }
      });

      if (!validInput) {
        alert("잘못된 입력입니다.");
        return;
      }

      // 사전에서 입력값 검사
      try {
        const response = await axios.get(apiUrl, {
          params: {
            inputValue: inputValue,
          },
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });
        const definition = response?.data?.body;

        // 사전에 있는 단어인지 확인
        if (definition) {
          setCells((prevCells) => {
            const newCells = [...prevCells];
            // 유효한 입력인 경우에만 셀의 내용을 업데이트
            highlightedCells.forEach((cell, index) => {
              if (newCells[cell.row][cell.col].owner !== -1) {
                newCells[cell.row][cell.col] = {
                  ...newCells[cell.row][cell.col],
                  char: inputValue.charAt(index),
                  owner: currentPlayer,
                };
              }
            });
            changePlayer();
            return newCells;
          });
        } else {
          alert("사전에 없는 단어입니다.");
        }
      } catch (error) {
        console.error("Error checking dictionary:", error);
        alert("사전 조회 중 오류가 발생했습니다.");
      }
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
                  onMouseDown={() =>
                    handleMouseDown(rowIndex, colIndex, cell.owner)
                  }
                  onMouseOver={() =>
                    handleMouseOver(rowIndex, colIndex, cell.owner)
                  }
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
