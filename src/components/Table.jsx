import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";
import InputModal from "./InputModal"; // 모달 컴포넌트 불러오기
import InfoModal from "./InfoModal"; // InfoModal 컴포넌트 불러오기
import SettingModal from "./SettingModal";
import Toast from "./Toast"; // Toast 컴포넌트 불러오기

const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;
const usingWordSet = new Set();

function Table() {
  const defaultSize = 10;
  const defaultWallCount = 20;
  const defaultStartLetterCount = 5;
  const defaultMaxTurn = 30;

  const [dragStart, setDragStart] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 현재 플레이어 번호 추가
  const [p1score, setP1score] = useState(0);
  const [p2score, setP2score] = useState(0);
  const [turn, setTurn] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // 토스트 메시지 상태
  const [size, setSize] = useState(defaultSize);
  const [wallCount, setWallCount] = useState(defaultWallCount);
  const [startLetterCount, setStartLetterCount] = useState(
    defaultStartLetterCount
  );
  const [maxTurn, setMaxTurn] = useState(defaultMaxTurn);

  const koreanCharacters =
    "가개경고공과구국그기나노다대도동라레로리마만면명모무문물미민반바발보부비사산상새서선성소수스시신아양어에오우원유의이인일임자장전정적제주중지진조차천초카크코타트파포프하한해화호";

  const minSize = 6;
  const maxSize = 20;

  const minMaxTurn = 8;
  const maxMaxTurn = 40;

  const initGame = (_size, _maxTurn, _wallCount, _startLetterCount) => {
    if (_size < minSize || _size > maxSize) {
      alert(`맵 크기는 ${minSize}이상, ${maxSize}이하여야 합니다.`);
      return -1;
    }
    if (_maxTurn < minMaxTurn || _maxTurn > maxMaxTurn) {
      alert(`턴 제한은 ${minMaxTurn}이상, ${maxMaxTurn}이하여야 합니다.`);
      return -1;
    }
    if (_wallCount < 0) {
      alert(`벽 개수는 음수일 수 없습니다.`);
      return -1;
    }
    if (_startLetterCount < 1) {
      alert(`시작 글자 수는 1 이상이여야 합니다.`);
      return -1;
    }
    if (_wallCount + _startLetterCount > _size * _size * 0.5) {
      alert(`벽의 개수와 시작 글자 수가 너무 큽니다.`);
      return -1;
    }

    usingWordSet.clear();
    setCurrentPlayer(1);
    setTurn(1);
    setP1score(0);
    setP2score(0);
    setSize(_size);
    setWallCount(_wallCount);
    setStartLetterCount(_startLetterCount);
    setMaxTurn(_maxTurn);

    const newCells = Array(_size)
      .fill(null)
      .map(() => Array(_size).fill({ char: "", owner: 0 }));
    let positions = new Set();

    while (positions.size < _startLetterCount) {
      positions.add(Math.floor(Math.random() * _size * _size));
    }

    positions.forEach((pos) => {
      const row = Math.floor(pos / _size);
      const col = pos % _size;
      newCells[row][col] = {
        char: koreanCharacters.charAt(
          Math.floor(Math.random() * koreanCharacters.length)
        ),
        owner: -1,
      };
    });

    let wallPositions = new Set();

    while (wallPositions.size < _wallCount) {
      const randomNum = Math.floor(Math.random() * _size * _size);
      if (!positions.has(randomNum)) wallPositions.add(randomNum);
    }

    wallPositions.forEach((pos) => {
      const row = Math.floor(pos / _size);
      const col = pos % _size;
      newCells[row][col] = {
        char: "",
        owner: -2,
      };
    });

    setCells(newCells);
  };

  useEffect(() => {
    initGame(size, maxTurn, wallCount, startLetterCount);
  }, []);

  const handleMouseDown = (row, col, owner) => {
    if (turn === maxTurn + 1) return;
    setDragStart({ row, col, owner });
    setHighlightedCells([{ row, col, owner }]);
  };

  const handleMouseUp = () => {
    if (turn === maxTurn + 1) return;
    if (dragStart) {
      highlightCells(dragStart, highlightedCells[highlightedCells.length - 1]);
      const set = new Set();
      highlightedCells.forEach((cell) => {
        set.add(cell.owner);
      });
      var isValid = true;
      if (!set.has(-1) && !set.has(currentPlayer)) isValid = false;
      else if (!set.has(0)) isValid = false;
      else if (set.size === 1) isValid = false;
      else {
        set.delete(-1);
        set.delete(0);
        set.delete(currentPlayer);
        if (set.size > 0) isValid = false;
      }
      if (isValid) setIsModalOpen(true);
      else endDrag();
    }
  };

  const handleMouseOver = (row, col) => {
    if (turn === maxTurn + 1) return;
    if (dragStart) {
      if (dragStart.row === row || dragStart.col === col) {
        highlightCells(dragStart, { row, col });
      }
    }
  };

  const handleTouchStart = (e, row, col, owner) => {
    if (turn === maxTurn + 1) return;
    setDragStart({ row, col, owner });
    setHighlightedCells([{ row, col, owner }]);
  };

  const handleTouchMove = (e) => {
    if (turn === maxTurn + 1) return;
    if (dragStart) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.getAttribute("row") && target.getAttribute("col")) {
        const row = parseInt(target.getAttribute("row"), 10);
        const col = parseInt(target.getAttribute("col"), 10);
        highlightCells(dragStart, { row, col });
      }
    }
  };

  const handleTouchEnd = () => {
    if (turn === maxTurn + 1) return;
    if (dragStart && highlightedCells.length > 0) {
      highlightCells(dragStart, highlightedCells[highlightedCells.length - 1]);
      const set = new Set();
      highlightedCells.forEach((cell) => {
        set.add(cell.owner);
      });
      var isValid = true;
      if (!set.has(-1) && !set.has(currentPlayer)) isValid = false;
      else if (!set.has(0)) isValid = false;
      else if (set.size === 1) isValid = false;
      else {
        set.delete(-1);
        set.delete(0);
        set.delete(currentPlayer);
        if (set.size > 0) isValid = false;
      }
      if (isValid) setIsModalOpen(true);
      else endDrag();
    }
  };

  const endDrag = () => {
    setHighlightedCells([]);
    setDragStart(null);
  };

  const highlightCells = (start, end) => {
    const newHighlighted = [];
    const startRow = start.row;
    const endRow = end.row;
    const startCol = start.col;
    const endCol = end.col;
    const rowIncrement = startRow <= endRow ? 1 : -1;
    const colIncrement = startCol <= endCol ? 1 : -1;

    if (startRow !== endRow && startCol !== endCol) return;

    for (let i = startRow; i !== endRow + rowIncrement; i += rowIncrement) {
      for (let j = startCol; j !== endCol + colIncrement; j += colIncrement) {
        newHighlighted.push({ row: i, col: j, owner: cells[i][j].owner });
      }
    }

    setHighlightedCells(newHighlighted);
  };

  const handleCellInput = async (inputValue) => {
    if (inputValue !== null) {
      // 입력이 유효한지 먼저 확인
      if (inputValue.length !== highlightedCells.length) {
        return "글자 길이가 다릅니다.";
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
        return "잘못된 입력입니다.";
      }

      if (usingWordSet.has(inputValue)) {
        return "이미 사용한 단어입니다.";
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
          usingWordSet.add(inputValue);
          setToast({ message: `${inputValue}: ${definition}` });
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
            currentPlayer === 1
              ? setP1score(p1score + inputValue.length)
              : setP2score(p2score + inputValue.length);
            changePlayer();
            endDrag();
            return newCells;
          });
        } else {
          return "사전에 없는 단어입니다.";
        }
      } catch (error) {
        console.error("Error checking dictionary:", error);
        return "사전 조회 중 오류가 발생했습니다.";
      }
      return "성공";
    }
    return "잘못된 입력입니다.";
  };

  const changePlayer = () => {
    setCurrentPlayer((prevPlayer) => {
      setTurn(turn + 1);
      return prevPlayer === 1 ? 2 : 1;
    });
  };

  const handleNewGame = () => {
    initGame(size, maxTurn, wallCount, startLetterCount);
  };

  const settingBoard = () => {
    setIsSettingModalOpen(true);
  };

  const getTemplate = () => {
    var template = "";
    for (var cell of highlightedCells) {
      const c = cells[cell.row][cell.col].char;
      if (c !== "") {
        template += c;
      } else {
        template += "□";
      }
    }
    return template;
  };

  return (
    <div className="game-container">
      <div className="feedback">
        <span>설문조사에 참여해주세요! </span>
        <a href="#">
          <strong>구글 폼 바로가기→</strong>
        </a>
      </div>
      <div className="upper-buttons">
        <button className="button" onClick={() => setIsInfoModalOpen(true)}>
          게임 방법
        </button>
        <button className="button" onClick={handleNewGame}>
          게임 재시작
        </button>
        <button className="button" onClick={settingBoard}>
          게임 설정
        </button>
      </div>
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <SettingModal
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
        initGame={initGame}
        _size={size}
        _maxTurn={maxTurn}
        _wallCount={wallCount}
        _startLetterCount={startLetterCount}
      />
      <div
        className="status-bar"
        style={{
          backgroundColor:
            turn >= maxTurn + 1
              ? "#f3f3f3"
              : currentPlayer === 1
              ? "#d0ebff"
              : "#ffd2d2",
        }}
      >
        {"["}
        {turn >= maxTurn + 1 ? maxTurn : turn} / {maxTurn}턴{"]"}
        {turn === maxTurn + 1
          ? " 게임 종료!"
          : " 유저 " + currentPlayer + "의 차례"}
      </div>
      <div className="player-info">
        <div className={"player-1 " + (currentPlayer === 1 ? "active" : "")}>
          <span>{p1score}점</span>
          <span>
            <strong>유저 1</strong> &lt;
            {currentPlayer === 1 ? "내 차례!" : "상대 차례"}
            &gt;
          </span>
        </div>
        <div className={"player-2 " + (currentPlayer === 2 ? "active" : "")}>
          <span>{p2score}점</span>
          <span>
            <strong>유저 2</strong> &lt;
            {currentPlayer === 2 ? "내 차례!" : "상대 차례"}
            &gt;
          </span>
        </div>
      </div>
      <div className="table-wrapper">
        <div className="table">
          {cells.map((row, rowIndex) => (
            <div className="tableRow" key={rowIndex}>
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  row={rowIndex}
                  col={colIndex}
                  className={
                    "tableCell " +
                    (cell.owner === -1
                      ? "special"
                      : cell.owner === 1
                      ? "player1"
                      : cell.owner === 2
                      ? "player2"
                      : cell.owner === -2
                      ? "wall"
                      : highlightedCells.some(
                          (cell) =>
                            cell.row === rowIndex && cell.col === colIndex
                        )
                      ? "highlighted"
                      : "")
                  } // owner에 따라 클래스를 동적으로 설정
                  onMouseDown={() =>
                    handleMouseDown(rowIndex, colIndex, cell.owner)
                  }
                  onMouseOver={() =>
                    handleMouseOver(rowIndex, colIndex, cell.owner)
                  }
                  onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                  onTouchStart={(e) =>
                    handleTouchStart(e, rowIndex, colIndex, cell.owner)
                  }
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {cell.char}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <InputModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          endDrag();
        }}
        onSubmit={(inputValue) => handleCellInput(inputValue)}
        getTemplate={getTemplate}
      />
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default Table;
