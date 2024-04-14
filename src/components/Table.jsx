import React from "react";
import "./Table.css"; // CSS 파일 임포트

function Table() {
  const size = 10;
  const rows = Array.from({ length: size }, (_, index) => index);
  const cols = rows;

  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            {cols.map((col) => (
              <td key={col}></td> // 좌표 값을 제거하고 비워둔 상태
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
