// InfoModal.js
import { useState } from "react";
import "./SettingModal.css"; // 스타일 파일, 필요에 따라 수정

function SettingModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>원하는 보드로 플레이하세요!</h2>
      </div>
    </div>
  );
}

export default SettingModal;
