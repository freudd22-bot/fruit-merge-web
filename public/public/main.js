// -------------------------------
// استيراد الإعدادات من config.js المحلي
// -------------------------------
import { CONFIG } from "../config.js"; // هذا الملف لن يُرفع للمستودع

const firebaseConfig = {
  apiKey: CONFIG.API_KEY,
  authDomain: "fruit-merge-web.firebaseapp.com",
  databaseURL: "https://fruit-merge-web-default-rtdb.firebaseio.com",
  projectId: "fruit-merge-web",
  storageBucket: "fruit-merge-web.appspot.com",
  messagingSenderId: CONFIG.CCP_NUMBER,
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// -------------------------------
// اللعبة
// -------------------------------
let grid=[],score=0,gems=0,target="";
const size=6;
const fruits=["🍎","🍌","🍊","🍓","🍐","🍇"];

document.getElementById("startBtn").onclick=()=>{
  document.getElementById("gameContainer").style.display="block";
  document.getElementById("startBtn").style.display="none";
  init();
  render();
};

function init(){
  grid=[];
  for(let r=0;r<size;r++){
    let row=[];
    for(let c=0;c<size;c++) row.push(randomFruit());
    grid.push(row);
  }
  newTarget();
}

function newTarget(){target=fruits[Math.floor(Math.random()*fruits.length)];document.getElementById("target").textContent=target;}
function randomFruit(){return fruits[Math.floor(Math.random()*fruits.length)];}

function render(){
  const game=document.getElementById("game");
  game.innerHTML="";
  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
      const cell=document.createElement("div");
      cell.className="cell";
      cell.textContent=grid[r][c];
      cell.onclick=()=>clickCell(r,c);
      game.appendChild(cell);
    }
  }
}

let selected=null;
function clickCell(r,c){
  if(!selected){selected=[r,c];return;}
  const [sr,sc]=selected;
  if(grid[sr][sc]===grid[r][c] && !(sr===r&&sc===c)){
    grid[sr][sc]=randomFruit();
    grid[r][c]=randomFruit();
    checkRows();
  }
  selected=null;
  render();
}

function checkRows(){
  for(let r=0;r<size;r++){
    if(grid[r].every(f=>f===target)){
      score+=100;
      gems=Math.floor(score/1000);
      newTarget();
    }
  }
  document.getElementById("score").textContent=score;
  document.getElementById("gems").textContent=gems;
}
