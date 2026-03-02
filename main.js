// -------------------------------
// Firebase Configuration
// -------------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fruit-merge-web.firebaseapp.com",
  databaseURL: "https://fruit-merge-web-default-rtdb.firebaseio.com",
  projectId: "fruit-merge-web",
  storageBucket: "fruit-merge-web.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// -------------------------------
// Google Login
// -------------------------------
const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const userStatus = document.getElementById("userStatus");

auth.onAuthStateChanged(user=>{
  if(user){
    userStatus.textContent = `👤 ${user.displayName || "User"}`;
    loginBtn.style.display="none";
    logoutBtn.style.display="inline-block";
    startBtn.style.display="inline-block";
    loadUserData(user.uid);
  }else{
    userStatus.textContent = "👤 زائر";
    loginBtn.style.display="inline-block";
    logoutBtn.style.display="none";
    startBtn.style.display="none";
  }
});

loginBtn.onclick=()=>{
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick=()=>{ auth.signOut(); };

// -------------------------------
// اللعبة
// -------------------------------
let grid=[],score=0,gems=0,target="";
const size=6;
const fruits=["🍎","🍌","🍊","🍓","🍐","🍇"];

startBtn.onclick=()=>{
  document.getElementById("gameContainer").style.display="block";
  startBtn.style.display="none";
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

function newTarget(){
  target=fruits[Math.floor(Math.random()*fruits.length)];
  document.getElementById("target").textContent=target;
}

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
    checkRows(auth.currentUser.uid);
  }
  selected=null;
  render();
}

function checkRows(uid){
  for(let r=0;r<size;r++){
    if(grid[r].every(f=>f===target)){
      score+=100;
      gems=Math.floor(score/1000);
      newTarget();
      if(uid){
        db.ref("users/"+uid).set({score:score,gems:gems});
      }
    }
  }
  document.getElementById("score").textContent=score;
  document.getElementById("gems").textContent=gems;
}

// -------------------------------
// تحميل بيانات المستخدم من Firebase
function loadUserData(uid){
  db.ref("users/"+uid).once("value").then(snap=>{
    const data = snap.val();
    if(data){
      score = data.score || 0;
      gems = data.gems || 0;
      document.getElementById("score").textContent=score;
      document.getElementById("gems").textContent=gems;
    }
  });
}
