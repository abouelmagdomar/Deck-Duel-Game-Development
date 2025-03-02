let userName = "UNSET";
let htmlBuilder = "";
var body = document.body;

let deckID = "";
let DeckURL = "";

var computerScore = 0;
var userScore = 0;

var cardSuit = "UNSET";
var cardColor = "UNSET";

var cardSuit = "";
var cardValue = 0;
var cardImage = "";

let cardSet = [];
let bigCard = "";
let remainingCards = 0;

let computerCards = "";

let userCards = "";

let pastGames = [];

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  getFirestore,
  collection,
  where,
  query,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1NQzIW1WBLhV_XRMYa3a-RsGUC4l0lb8",
  authDomain: "deckduel-3a114.firebaseapp.com",
  projectId: "deckduel-3a114",
  storageBucket: "deckduel-3a114.appspot.com",
  messagingSenderId: "812430284584",
  appId: "1:812430284584:web:1be6b65c2e5cd40e11a21d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDeck() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
    function (response) {
      response.json().then(function (deck) {
        deckID = deck.deck_id;
        DeckURL =
          `https://deckofcardsapi.com/api/deck/` + deckID + `/draw/?count=11`;
      });
    },
  );
}

getDeck();

function drawCards() {
  fetch(DeckURL).then(function (response) {
    response.json().then(function (current) {
      computerCards = "";
      userCards = "";
      cardSet = current.cards;
      remainingCards = current.remaining;

      for (let x = 0; x < 5; x++) {
        computerCards += `
        <img
          src="https://deckofcardsapi.com/static/img/back.png"
          class="card"
          id = "${current.cards[x].code}"
        />
        `;
      }
      document.getElementById("computerCards").innerHTML = computerCards;

      for (let x = 5; x < 10; x++) {
        userCards += `
        <img
          src="${current.cards[x].image}"
          class="card"
          id = "${current.cards[x].code}"
          onclick = "compareCards(${x})"
        />
        `;
      }
      document.getElementById("userCards").innerHTML = userCards;

      cardSuit = current.cards[10].suit;

      if (cardSuit === "DIAMONDS" || cardSuit === "HEARTS") {
        cardColor = "RED";
      } else if (cardSuit === "SPADES" || cardSuit === "CLUBS") {
        cardColor = "BLACK";
      }
      bigCard = `
      <img
      src="https://deckofcardsapi.com/static/img/back.png"
      class="bigCard"
      id="card11"
    />
    <div id="gameStatus">
      <h2>The next card is</h2>
      <p id="cardColor">${cardColor}</p>
    </div>
      `;

      document.getElementById("middleBar").innerHTML = bigCard;

      if (cardColor === "RED") {
        document.getElementById("cardColor").style.backgroundColor = "#b11a21";
      } else if (cardColor === "BLACK") {
        document.getElementById("cardColor").style.backgroundColor = "black";
      }
    });
  });
}

window.beginGame = function beginGame() {
  userName = document.getElementById("nameInput").value;
  body.style.backgroundColor = "white";

  drawCards();

  htmlBuilder = `
  <div id="center-container">
  <div id="topBar" class="playerCards">
    <div class="dataTab" id="el1">
      <p class="identifier">Computer</p>
      <span class="score">${computerScore}</span>
    </div>
    <div id="computerCards" class="cards"></div>
    <div id="el1t"></div>
  </div>
  <div id="middleBar"></div>
  <div id="bottomBar" class="playerCards">
    <div class="dataTab" id="el2">
      <p class="identifier">${userName}</p>
      <span class="score">${userScore}</span>
    </div>
    <div id="userCards" class="cards"></div>
    <div id="el2t"></div>
  </div>
</div>
    `;

  document.body.innerHTML = htmlBuilder;

  var sourceElement = document.querySelector("#el1");
  var targetElement = document.querySelector("#el1t");
  var sourceWidth = sourceElement.offsetWidth;
  targetElement.style.width = sourceWidth + "px";

  var sourceElement = document.querySelector("#el2");
  var targetElement = document.querySelector("#el2t");
  var sourceWidth = sourceElement.offsetWidth;
  targetElement.style.width = sourceWidth + "px";

};

window.playAgain = function playAgain() {
  getDeck();

  computerScore = 0;
  userScore = 0;

  htmlBuilder = `
    <header>
      <h1>DECKDUEL</h1>
    </header>
    <div id="bottom">
      <input type="text" id="nameInput" placeholder="Enter your name..." />
      <button type="button" onclick="beginGame()" class="startButton">
        Start
      </button>
    </div>
  `;

  document.body.innerHTML = htmlBuilder;
}

window.compareCards = function compareCards(y) {
  console.log(cardSet);
  let selectedUser = cardSet[y].code;
  let drawCard = cardSet[10].code;

  let options = [];
  let selectedComp = "";
  let randomNumber = 10;
  let targetColor = "";
  let newObject = {};
  let statement = "";

  for (let x = 0; x < 5; x++) {
    if (cardSet[x].suit === "DIAMONDS" || cardSet[x].suit === "HEARTS") {
      targetColor = "RED";
    } else if (cardSet[x].suit === "SPADES" || cardSet[x].suit === "CLUBS") {
      targetColor = "BLACK";
    }

    if (targetColor == cardColor) {
      newObject = { code: cardSet[x].code, src: cardSet[x].image };
      options.push(newObject);
    } else {
    }
  }
  if (options.length == 0) {
    randomNumber = Math.floor(Math.random() * 4);
    selectedComp = cardSet[randomNumber].code;
    var imgElement = document.getElementById(selectedComp);
    imgElement.src = `${cardSet[randomNumber].image}`;
  } else {
    randomNumber = Math.floor(Math.random() * options.length);
    selectedComp = options[randomNumber].code;
    var imgElement = document.getElementById(selectedComp);
    imgElement.src = `${options[randomNumber].src}`;
  }

  var imgElement = document.getElementById("card11");
  imgElement.src = `${cardSet[10].image}`;

  userCards = "";

  for (let x = 5; x < 10; x++) {
    userCards += `
    <img
      src="${cardSet[x].image}"
      class="card"
      id = "${cardSet[x].code}"
      onclick = ""
    />
    `;
  }
  document.getElementById("userCards").innerHTML = userCards;

  let element = document.getElementById(selectedUser);
  element.style.marginBottom = "20px";

  let drawValue = drawCard[0];
  switch (drawValue) {
    case "A":
      drawValue = 1;
      break;
    case "J":
      drawValue = 11;
      break;
    case "Q":
      drawValue = 12;
      break;
    case "K":
      drawValue = 13;
      break;
    case "0":
      drawValue = 10;
      break;
  }

  let userValue = selectedUser[0];
  switch (userValue) {
    case "A":
      userValue = 1;
      break;
    case "J":
      userValue = 11;
      break;
    case "Q":
      userValue = 12;
      break;
    case "K":
      userValue = 13;
      break;
    case "0":
      userValue = 10;
      break;
  }

  let computerValue = selectedComp[0];
  switch (computerValue) {
    case "A":
      computerValue = 1;
      break;
    case "J":
      computerValue = 11;
      break;
    case "Q":
      computerValue = 12;
      break;
    case "K":
      computerValue = 13;
      break;
    case "0":
      computerValue = 10;
      break;
  }

  let userColor = "";
  let computerColor = "";

  switch (selectedUser[1]) {
    case "H":
      userColor = "RED";
      break;
    case "D":
      userColor = "RED";
      break;
    case "S":
      userColor = "BLACK";
      break;
    case "C":
      userColor = "BLACK";
      break;
  }

  switch (selectedComp[1]) {
    case "H":
      computerColor = "RED";
      break;
    case "D":
      computerColor = "RED";
      break;
    case "S":
      computerColor = "BLACK";
      break;
    case "C":
      computerColor = "BLACK";
      break;
  }

  let userCloseness = drawValue - userValue;
  let compCloseness = drawValue - computerValue;

  if (selectedUser[1] === drawCard[1]) {
    userCloseness += 0;
  } else if (userColor === cardColor) {
    userCloseness += 2;
  } else {
    userCloseness += 4;
  }

  if (selectedUser[1] === drawCard[1]) {
    compCloseness += 0;
  } else if (userColor === cardColor) {
    compCloseness += 2;
  } else {
    compCloseness += 4;
  }

  if (userValue > drawValue) {
    userCloseness = 99;
  }
  if (computerValue > drawValue) {
    compCloseness = 99;
  }

  console.log("User closeness: " + userCloseness);
  console.log("Comp closeness: " + compCloseness);

  if (userCloseness < compCloseness) {
    statement = `${userName} wins this round!`;
    userScore +=
      parseInt(drawValue) + parseInt(userValue) + parseInt(computerValue);
  } else if (compCloseness < userCloseness) {
    statement = `Computer wins this round!`;
    computerScore +=
      parseInt(drawValue) + parseInt(userValue) + parseInt(computerValue);
  } else if (userCloseness == 99 && compCloseness == 99) {
    statement = "No one wins this round!";
  } else {
    statement = "No one wins this round!";
  }

  console.log("Player Card: " + selectedUser);
  console.log("Computer Card: " + selectedComp);
  console.log("Draw Card: " + drawCard);

  htmlBuilder = `
  <div id="gameStatus">
    <h2>${statement}</h2>
    <p id="nextRound" onclick="nextRound()">Next Round</p>
  </div>
  `;

  document.getElementById("gameStatus").innerHTML = htmlBuilder;
  document.getElementById("el1").innerHTML = `
    <p class="identifier">Computer</p>
    <span class="score">${computerScore}</span>
  `;
  document.getElementById("el2").innerHTML = `
    <p class="identifier">${userName}</p>
    <span class="score">${userScore}</span>
  `;
};

async function finalScreen() {

  let gameRef = collection(db, "gameplay");
  let q = query(gameRef, where("username","==",`${userName}`));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach(function (doc) {
    pastGames.push(doc.data());
  });

  let print = "";

  for (let x=0;x < pastGames.length;x++) {
    print += `
    <div class="scoreboard">
        <div class="data-container">
          <p>${pastGames[x].username}</p>
          <p>${pastGames[x].user}</p>
        </div>
        <div class="data-container">
          <p>Computer</p>
          <p>${pastGames[x].computer}</p>
        </div>
      </div>
    `;
  }

  let gameCollection = collection(db,"gameplay");
  gameRef = await addDoc(gameCollection, {
    username: `${userName}`,
    user: `${userScore}`,
    computer: `${computerScore}`,
  });

  let finalStatement = "";
  let ACUN = "";

  if (userScore > computerScore) {
    ACUN = userName.toUpperCase();
    finalStatement = `${ACUN} WINS!`;
  } else if (computerScore > userScore) {
    finalStatement = "COMPUTER WINS!";
  } else {
    finalStatement = "IT'S A TIE!";
  }

  htmlBuilder = `
  <div class="credits">
      <h1 class="final-title">${finalStatement}</h1>
      <div class="scoreboard">
        <div class="data-container">
          <p>${userName}</p>
          <p>${userScore}</p>
        </div>
        <div class="data-container">
          <p>Computer</p>
          <p>${computerScore}</p>
        </div>
      </div>
      <button class="startButton" type="button" onclick="playAgain()">
        Play Again
      </button>
      <br />
      <h1 class="final-title" style="font-size: 35px;">Play History</h1>
      ${print}
    </div>
  `;

  document.body.innerHTML = htmlBuilder;
  document.body.style.backgroundColor = "black";
}

window.nextRound = function nextRound() {
  console.log("Remaining Cards: " + remainingCards);
  if (remainingCards < 11) {
    finalScreen();
    return;
  }

  drawCards();

  htmlBuilder = `
  <div id="center-container">
  <div id="topBar" class="playerCards">
    <div class="dataTab" id="el1">
      <p class="identifier">Computer</p>
      <span class="score">${computerScore}</span>
    </div>
    <div id="computerCards" class="cards"></div>
    <div id="el1t"></div>
  </div>
  <div id="middleBar"></div>
  <div id="bottomBar" class="playerCards">
    <div class="dataTab" id="el2">
      <p class="identifier">${userName}</p>
      <span class="score">${userScore}</span>
    </div>
    <div id="userCards" class="cards"></div>
    <div id="el2t"></div>
  </div>
</div>
    `;

  document.body.innerHTML = htmlBuilder;

  var sourceElement = document.querySelector("#el1");
  var targetElement = document.querySelector("#el1t");
  var sourceWidth = sourceElement.offsetWidth;
  targetElement.style.width = sourceWidth + "px";

  var sourceElement = document.querySelector("#el2");
  var targetElement = document.querySelector("#el2t");
  var sourceWidth = sourceElement.offsetWidth;
  targetElement.style.width = sourceWidth + "px";

};
