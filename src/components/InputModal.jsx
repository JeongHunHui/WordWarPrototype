import React, { useState, useEffect } from "react";
import "./InputModal.css";

function InputModal({ isOpen, onClose, onSubmit, n }) {
  const [inputValue, setInputValue] = useState("");

  // 모달이 열릴 때마다 inputValue를 초기화
  useEffect(() => {
    if (isOpen) {
      setInputValue(""); // 모달이 열리면 입력값을 초기화
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p>{n}글자를 입력하세요:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => onSubmit(inputValue)}>Submit</button>
      </div>
    </div>
  );
}

export default InputModal;
