// InfoModal.js
import { useState, useEffect } from "react";
import "./InfoModal.css"; // 스타일 파일, 필요에 따라 수정

function InfoModal({ isOpen, onClose }) {
  const minPage = 1;
  const maxPage = 4;
  const [page, setPage] = useState(minPage);

  useEffect(() => {
    if (isOpen) {
      setPage(minPage);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>낱말로 즐기는 보드게임, 끄땅!</h2>
        <ul>
          {page === 1 && (
            <>
              <li>
                <img src="/tuto/tutorial-demo.gif" alt="tutorial 1" />
              </li>
              <li>끄땅은 보드에 단어를 입력하여 땅을 차지하는 게임입니다.</li>
              <li>
                * 현재는 온라인 대결이 안되고, 두 명이 한 기기로 해야 해요.
              </li>
            </>
          )}
          {page === 2 && (
            <>
              <li>
                <img src="/tuto/1.png" alt="tutorial 1" />
              </li>
              <li>1. 단어를 입력할 칸을 순서대로 드래그해주세요.</li>
              <li>* 자신의 칸이나 녹색인 칸을 포함해야 해요.</li>
              <li>* 벽이나 상대의 칸을 포함하면 안돼요.</li>
              <li>* 빈 칸을 하나 이상 선택해야 해요.</li>
            </>
          )}
          {page === 3 && (
            <>
              <li>
                <img src="/tuto/2.png" alt="tutorial 2" />
              </li>
              <li>2. 원하는 단어를 입력해주세요.</li>
              <li>* DB에 없는 단어는 쓸 수 없어요.</li>
              <li>* 이미 작성된 글자를 무시할 수 없어요.</li>
            </>
          )}
          {page === 4 && (
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
              page === maxPage
                ? () => {
                    setPage(0);
                    onClose();
                  }
                : () => setPage((pre) => pre + 1)
            }
            style={{ cursor: "pointer" }}
          >
            {`${page === maxPage ? "알겠어요" : "다음"} (${page}/${maxPage})`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
