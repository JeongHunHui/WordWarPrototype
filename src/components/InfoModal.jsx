// InfoModal.js
import { useState } from "react";
import "./InfoModal.css"; // 스타일 파일, 필요에 따라 수정

function InfoModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>낱말로 즐기는 보드게임, 끄땅!</h2>
        <ul>
          {page === 0 && (
            <>
              <li>
                <img src="/tuto/1.png" alt="tutorial 1" />
              </li>
              <li>1. 낱말을 작성할 칸들을 순서대로 드래그해주세요.</li>
              <li>* 빈 칸을 적어도 하나 선택해야해요.</li>
              <li>* 자신이 사용했거나 녹색인 칸을 반드시 포함해야해요.</li>
              <li>* 벽이나 상대가 선택한 칸을 지나가면 안돼요.</li>
            </>
          )}
          {page === 1 && (
            <>
              <li>
                <img src="/tuto/2.png" alt="tutorial 2" />
              </li>
              <li>2. 원하는 단어를 입력해주세요.</li>
              <li>* 1글자이거나 DB에 없는 단어는 쓸 수 없어요.</li>
              <li>* 이미 작성된 글자를 무시할 수 없어요.</li>
            </>
          )}
          {page === 2 && (
            <>
              <li>
                <img src="/tuto/3.png" alt="tutorial 2" />
              </li>
              <li>3. 재미있게 즐겨주세요!</li>
              <li>* 구글 폼 작성해주시면 많은 도움이 돼요!</li>
            </>
          )}
        </ul>
        <div className="page">
          <div
            onClick={() => setPage((pre) => Math.max(0, pre - 1))}
            style={{ color: page === 0 ? "gray" : "black", cursor: "pointer" }}
          >
            이전
          </div>
          <div
            onClick={
              page === 2
                ? () => {
                    setPage(0);
                    onClose();
                  }
                : () => setPage((pre) => pre + 1)
            }
            style={{ cursor: "pointer" }}
          >
            {page === 2 ? "알겠어요" : "다음"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
