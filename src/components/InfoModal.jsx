// InfoModal.js
import React from "react";
import "./InfoModal.css"; // 스타일 파일, 필요에 따라 수정

function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>끝말잇기와 땅따먹기를 합치다!</h2>
        <p>
          끝말잇기로 땅따먹기를 할 수 있는 게임, <b>끝땅</b>입니다!
        </p>
        <ul>
          <li>플레이어는 매턴 단어를 만들어 점수를 얻습니다.</li>
          <li>각 단어는 사전에 등록된 단어여야 합니다.</li>
          <li>더 많은 점수를 얻기 위해서는 더 긴 단어를 만들어야 합니다.</li>
        </ul>
        <p>즐거운 게임 되세요!</p>
      </div>
    </div>
  );
}

export default InfoModal;
