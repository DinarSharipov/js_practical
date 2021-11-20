const CODES = {
  A: 65,
  Z: 90,
};

function createCell(colsCount) {
  const cols = new Array(colsCount)
      .fill(`<div class="cell" contenteditable="true"></div>`)
      .join('');
  return cols;
}

function toColumn(char) {
  return `<div class="column">${char}
  <div class="col-resize"  data-resize="col"></div>
  </div> `;
}

function createRow(num, content) {
  const resizer = num ? `<div class="row-resize" data-resize="row"></div>` : '';
  return `<div class="row">
  <div class="row-info">${num ? num : ''}
  ${resizer}
  </div>
  <div class="row-data">${content}</div>
  </div>`;
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toColumn)
      .join('');

  rows.push(createRow(null, cols));

  for (let i = 0; i < rowsCount; i++) {
    rows.push(createRow(i + 1, createCell(colsCount)));
  }
  return rows.join('');
}
