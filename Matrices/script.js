const themeSelect = document.getElementById("theme-select");
const darkToggle = document.getElementById("dark-toggle");
document.getElementById("info-btn").addEventListener("mouseover", () => {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.toggle("visible");
});

function updateTheme() {
  const theme = themeSelect.value;
  const isDark = document.body.classList.contains("dark");
  document.body.className = `theme-${theme}` + (isDark ? " dark" : "");
}

themeSelect.addEventListener("change", updateTheme);
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.innerText = document.body.classList.contains("dark") ? "☀️ Light Mode": "🌙 Dark Mode";
});


function generateMatrixInputs(rows, cols, id, random=false) {
  let html = `<h3>Matrix ${id}</h3><div class="matrix-wrapper"><table>`;
  for (let i = 0; i < rows; i++) {
    html += "<tr>";
    for (let j = 0; j < cols; j++) {
      html += `<td><input type="number" id="${id}-${i}-${j}" value="${random ? Math.floor(Math.random() * 10): 0}" /></td>`;
    }
    html += "</tr>";
  }
  html += "</table></div>";
  return html;
}

function readMatrix(rows, cols, id) {
  let mat = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      const val = parseFloat(document.getElementById(`${id}-${i}-${j}`).value);
      if (isNaN(val)) throw new Error(`Invalid input at ${id}[${i}][${j}]`);
      row.push(val);
    }
    mat.push(row);
  }
  return mat;
}


function multiply(A, B) {
  let result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function determinant(A) {
  let n = A.length;
  let M = A.map(r => [...r]);
  let det = 1;
  for (let i = 0; i < n; i++) {
    if (M[i][i] === 0) {
      let swap = i + 1;
      while (swap < n && M[swap][i] === 0) swap++;
      if (swap === n) return 0;
      [M[i], M[swap]] = [M[swap], M[i]];
      det *= -1;
    }
    det *= M[i][i];
    for (let j = i + 1; j < n; j++) {
      let factor = M[j][i] / M[i][i];
      for (let k = i; k < n; k++) {
        M[j][k] -= factor * M[i][k];
      }
    }
  }
  return det;
}

function inverse(A) {
  const n = A.length;
  if (determinant(A) === 0) throw new Error("❌ Not invertible");

  let M = A.map((r, i) => [
    ...r,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  ]);

  for (let i = 0; i < n; i++) {
    if (M[i][i] === 0) {
      let swapRow = -1;
      for (let k = i + 1; k < n; k++) {
        if (M[k][i] !== 0) {
          swapRow = k;
          break;
        }
      }
      [M[i], M[swapRow]] = [M[swapRow], M[i]];
    }
    let pivot = M[i][i];
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = M[k][i];
        for (let j = 0; j < 2 * n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  return M.map(row => row.slice(n));
}


function solve(A, B) {
  if (B[0].length !== 1) return "❌ B must be a column vector!";
  let n = A.length;

  // Merge A and B into one augmented matrix
  let M = A.map((r, i) => [...r, B[i][0]]);

  for (let i = 0; i < n; i++) {
    // Check if pivot is zero, and swap with a row below if needed
    if (M[i][i] === 0) {
      let swapRow = -1;
      for (let k = i + 1; k < n; k++) {
        if (M[k][i] !== 0) {
          swapRow = k;
          break;
        }
      }
      if (swapRow === -1) return "❌ No unique solution (pivot is zero and cannot swap)";
      [M[i], M[swapRow]] = [M[swapRow], M[i]];
    }

    let pivot = M[i][i];
    for (let j = 0; j <= n; j++) {
      M[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = M[k][i];
        for (let j = 0; j <= n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  return M.map(row => [row[n]]);
}

function formatResult(result) {
  if (typeof result === "string") return result;

  if (Array.isArray(result)) {
    const formatted = result.map(row =>
      `[${row.map(val => Number(val.toFixed(3))).join(", ")}]`
    );
    return `[${formatted.join(", ")}]`;
  }

  return `<pre>${JSON.stringify(result, null, 2)}</pre>`;
}

const generateNullBtn = document.getElementById("generate-null");
const generateRandomBtn = document.getElementById("generate-random");
const computeBtn = document.getElementById("compute");
const clearBtn = document.getElementById("clear");
const operationSelect = document.getElementById("operation");
const matrixInputs = document.getElementById("matrix-inputs");
const matrixResults = document.getElementById("matrix-result");
const resultDiv = document.getElementById("result");
const $rowsA = document.getElementById("rowsA");
const $colsA = document.getElementById("colsA");
const $rowsB = document.getElementById("rowsB");
const $colsB = document.getElementById("colsB");

function toggleMatrixBInputs(op) {
  const show = op === "multiply" || op === "solve";
  document.getElementById("matrixB-dimensions").style.display = show ? "" : "none";
}

operationSelect.addEventListener("change", () => {
  toggleMatrixBInputs(operationSelect.value);
});

function generateHandler(random = false) {
  const rowsA = +$rowsA.value;
  const colsA = +$colsA.value;
  const op = operationSelect.value;

  let html = generateMatrixInputs(rowsA, colsA, "A", random);
  if (op === "multiply" || op === "solve") {
    const rowsB = +$rowsB.value;
    const colsB = +$colsB.value;
    html += generateMatrixInputs(rowsB, colsB, "B", random);
  }
  matrixInputs.innerHTML = html;
  matrixResults.hidden = matrixInputs.hidden = false;
}

generateNullBtn.addEventListener("click", () => generateHandler());
generateRandomBtn.addEventListener("click", () => generateHandler(true));

computeBtn.addEventListener("click", () => {
  const op = operationSelect.value;
  const rowsA = +$rowsA.value;
  const colsA = +$colsA.value;
  const rowsB = +$rowsB.value;
  const colsB = +$colsB.value;

  let result;

  try {
    const A = readMatrix(rowsA, colsA, "A");

    switch (op) {
      case "multiply":
        if (colsA !== rowsB) throw new Error("❌ Invalid dimensions for multiplication!");
        const B_mul = readMatrix(rowsB, colsB, "B");
        result = multiply(A, B_mul);
        break;

      case "det":
        if (rowsA !== colsA) throw new Error("❌ Not a square matrix!");
        result = determinant(A);
        break;

      case "inverse":
        if (rowsA !== colsA) throw new Error("❌ Not a square matrix!");
        result = inverse(A);
        break;

      case "solve":
        if (rowsA !== rowsB || colsB !== 1) throw new Error("❌ For solving, B must be a column vector with same row count as A!");
        const B_solve = readMatrix(rowsB, colsB, "B");
        result = solve(A, B_solve);
        break;

      default:
        throw new Error("❌ Unknown operation!");
    }
  } catch (e) {
    result = e.message;
  }
  resultDiv.innerHTML = formatResult(result);
});

// Clear Buttons
clearBtn.addEventListener("click", () => {
  $rowsA.value = $colsA.value = $rowsB.value = $colsB.value = 2;
  matrixInputs.innerHTML = "";
  resultDiv.innerHTML = "";
  matrixResults.hidden = matrixInputs.hidden = true;
});