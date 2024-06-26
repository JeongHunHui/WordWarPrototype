import React, { useState } from "react";
import "./SettingModal.css"; // 스타일 파일, 필요에 따라 수정

function SettingModal({
  isOpen,
  onClose,
  initGame,
  _size,
  _maxTurn,
  _wallCount,
  _startLetterCount,
}) {
  const [size, setSize] = useState(_size);
  const [maxTurn, setMaxTurn] = useState(_maxTurn);
  const [wallCount, setWallCount] = useState(_wallCount);
  const [startLetterCount, setStartLetterCount] = useState(_startLetterCount);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // initGame 함수를 업데이트하려면 size, maxTurn, wallCount, startLetterCount를 인자로 받아야 함
    if (initGame(size, maxTurn, wallCount, startLetterCount) !== -1) onClose(); // 모달 닫기
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>게임 설정</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            <span>맵 크기{"(N x N)"}</span>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            <span>턴 제한</span>
            <input
              type="number"
              value={maxTurn}
              onChange={(e) => setMaxTurn(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            <span>벽 개수</span>
            <input
              type="number"
              value={wallCount}
              onChange={(e) => setWallCount(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            <span>시작 글자 수</span>
            <input
              type="number"
              value={startLetterCount}
              onChange={(e) => setStartLetterCount(Number(e.target.value))}
            />
          </label>
          <br />
          <button className="newStart" onClick={handleSubmit}>
            바뀐 설정으로 게임 시작!
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingModal;
