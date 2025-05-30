const character = document.getElementById("character");
const flower = document.getElementById("flower");
const shrine = document.getElementById("shrine");
const letterModal = document.getElementById("letter-modal");
const music = document.getElementById("bg-music");
const startBtn = document.getElementById("start-btn");

let posX = 100;
let posY = 280;
const speed = 10;

let hasFlower = false;
let attempts = 0;

function updatePosition() {
  character.style.left = posX + "px";
  character.style.top = posY + "px";
}

function isNear(x1, y1, x2, y2, range = 30) {
  return Math.abs(x1 - x2) <= range && Math.abs(y1 - y2) <= range;
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (posY - speed >= 0) posY -= speed;
      break;
    case "ArrowDown":
    case "s":
      if (posY + speed <= 560) posY += speed;
      break;
    case "ArrowLeft":
    case "a":
      if (posX - speed >= 0) posX -= speed;
      break;
    case "ArrowRight":
    case "d":
      if (posX + speed <= 760) posX += speed;
      break;
    case "e":
      // Interact key
      // Pick flower if close and haven't picked yet
      if (!hasFlower && isNear(posX, posY, 530, 250, 30) && flower.style.display !== "none") {
        hasFlower = true;
        flower.style.display = "none";
        alert("You picked a flower 💐!");
      }
      // Place flower at shrine if close and have flower
      else if (hasFlower && isNear(posX, posY, 100, 400, 30)) {
        showLetter();
      }
      break;
  }
  updatePosition();
});

function showLetter() {
  letterModal.classList.remove("hidden");
}

function answerYes() {
  letterModal.innerHTML = "<h2>Yay!! 💖💍</h2><p>I'm so happy!</p>";
}

function answerNo() {
  attempts++;
  if (attempts < 3) {
    alert("Hmm... let me try again!");
    letterModal.classList.add("hidden");
  } else {
    letterModal.innerHTML = "<h2>Okay... 😢</h2><p>I understand.</p>";
  }
}

startBtn.addEventListener("click", () => {
  music.play().then(() => {
    startBtn.style.display = "none";
  }).catch((err) => {
    console.log("Music play failed:", err);
  });
});

// Initialize character position
updatePosition();
