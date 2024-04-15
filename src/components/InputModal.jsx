import React, { useState, useEffect, useRef } from "react";
import "./InputModal.css";

function InputModal({ isOpen, onClose, onSubmit, getTemplate }) {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setErrorMessage("");
      setMessage(getTemplate());
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // 키보드 이벤트 핸들러 등록
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      // 이벤트 리스너 추가
      document.addEventListener("keydown", handleKeyDown);

      // 컴포넌트가 언마운트되거나 업데이트될 때 이벤트 리스너 제거
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p className="message">{message}</p>
        <form>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const result = await onSubmit(inputValue);
              if (result === "성공") onClose();
              else setErrorMessage(result);
            }}
          >
            Submit
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default InputModal;
