import React, { useState, useEffect, useRef } from "react";
import "./InputModal.css";

function InputModal({ isOpen, onClose, onSubmit, n }) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setErrorMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
