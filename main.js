// ===============================
// حماية ذكية للدومين
// ===============================
(function () {
  const host = window.location.hostname;

  const allowed =
    host.includes("github.io") ||
    host.includes("web.app") ||
    host.includes("firebaseapp.com") ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (!allowed) {
    document.body.innerHTML =
      "<h2 style='text-align:center;margin-top:50px'>🚫 غير مصرح بتشغيل اللعبة هنا</h2>";
    throw new Error("Blocked");
  }
})();

// ===============================
// Firebase Configuration
// ===============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fruit-merge-web.firebaseapp.com",
  databaseURL: "https://fruit-merge-web-default-rtdb.firebaseio.com",
  projectId: "fruit-merge-web",
  storageBucket: "fruit-merge-web.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
}

// ===============================
// إعدادات اللعبة
// ===============================
let grid = [];
let score = 0;
let gems = 0;
let target = "";

const size = 6;
const fruits = ["🍎","🍌","🍊","🍓","🍐","🍇"];

const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");

if (startBtn) {
  startBtn.onclick = () => {
    gameContainer.style.display = "block";
    startBtn.style.display = "none";
    init();
    render();
  };
}

// ===============================
// بدء اللعبة
// ===============================
function init() {
  grid = [];
  score = 0;
  gems = 0;

  updateScore();

  for (let r = 0; r < size; r++) {
    let row = [];
    for (let c = 0; c < size; c++) {
      row.push(randomFruit());
    }
    grid.push(row);
  }

  newTarget();
}

function newTarget() {
  target = fruits[Math.floor(Math.random() * fruits.length)];
  const targetEl = document.getElementById("target");
  if (targetEl) targetEl.textContent = target;
}

function randomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

// ===============================
// رسم الشبكة
// ===============================
function render() {
  const game = document.getElementById("game");
  if (!game) return;

  game.innerHTML = "";

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[r][c];
      cell.onclick = () => clickCell(r, c);
      game.appendChild(cell);
    }
  }
}

let selected = null;

function clickCell(r, c) {
  if (!selected) {
    selected = [r, c];
    return;
  }

  const [sr, sc] = selected;

  if (grid[sr][sc] === grid[r][c] && !(sr === r && sc === c)) {
    grid[sr][sc] = randomFruit();
    grid[r][c] = randomFruit();
    checkRows();
  }

  selected = null;
  render();
}

// ===============================
// فحص الصفوف
// ===============================
function checkRows() {
  for (let r = 0; r < size; r++) {
    if (grid[r].every(f => f === target)) {
      score += 100;
      gems = Math.floor(score / 1000);
      newTarget();
    }
  }

  updateScore();
}

function updateScore() {
  const scoreEl = document.getElementById("score");
  const gemsEl = document.getElementById("gems");

  if (scoreEl) scoreEl.textContent = score;
  if (gemsEl) gemsEl.textContent = gems;
}

// ===============================
// المستخدمون النشطون (اختياري)
// ===============================
function trackActive() {
  if (typeof firebase === "undefined") return;

  const ref = firebase.database().ref("active/test");
  ref.set(true);
  ref.onDisconnect().remove();

  firebase.database().ref("active").on("value", snap => {
    const el = document.getElementById("activeUsers");
    if (el) {
      el.innerHTML =
        "🟢 المستخدمون النشطون: " +
        snap.numChildren() +
        "<span class='english'>Active Users</span>";
    }
  });
}

// إذا أردت تفعيلها احذف التعليق
// trackActive();
