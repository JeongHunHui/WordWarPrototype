// Toast.js
import React, { useEffect } from "react";
import "./Toast.css"; // 스타일 파일

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3초 후 토스트 메시지 닫기
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast">{message}</div>;
}

export default Toast;
