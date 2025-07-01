// Game State
let gameState = {
  spaceCompleted: false,
  flappyCompleted: false,
  hasFlower: false,
  attempts: 0,
  character: { x: 100, y: 280, direction: 'right' }
};

// DOM Elements
const character = document.getElementById('character');
let flowerElement = null;

// Music System
const musicTracks = [
  { id: 'bg-music', name: 'Valentine', src: 'valentine.mp3' },
  { id: 'bg-music-2', name: 'Falling Behind', src: 'fallingbehind.mp3' },
  { id: 'bg-music-3', name: 'Misty', src: 'misty.mp3' }
];

let currentTrackIndex = 0;
let isPlaying = false;
let currentAudio = null;
let gameMusic = null;
let isMuted = false;

// Initialize game
function initGame() {
  generateHeartFlowers();
  updateCharacterPosition();
  updateQuestStatus();
  initMusicPlayer();
  setupEventListeners();
}

// Music Player Functions
function initMusicPlayer() {
  currentAudio = document.getElementById('bg-music');
  updateSongTitle();
  
  // Set initial volume
  setVolume(50);
  
  // Auto-play with user interaction
  document.addEventListener('click', () => {
    if (!isPlaying) {
      playCurrentTrack();
    }
  }, { once: true });
}

function updateSongTitle() {
  document.getElementById('current-song').textContent = musicTracks[currentTrackIndex].name;
}

function playCurrentTrack() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  currentAudio = document.getElementById(musicTracks[currentTrackIndex].id);
  currentAudio.volume = isMuted ? 0 : 0.5;
  
  currentAudio.play().then(() => {
    isPlaying = true;
    document.getElementById('play-pause-btn').textContent = '⏸️';
    updateSongTitle();
  }).catch(e => {
    console.log("Audio play failed:", e);
    isPlaying = false;
    document.getElementById('play-pause-btn').textContent = '▶️';
  });
}

function togglePlayPause() {
  if (!currentAudio) return;
  
  if (isPlaying) {
    currentAudio.pause();
    isPlaying = false;
    document.getElementById('play-pause-btn').textContent = '▶️';
  } else {
    currentAudio.play().then(() => {
      isPlaying = true;
      document.getElementById('play-pause-btn').textContent = '⏸️';
    }).catch(e => {
      console.log("Audio play failed:", e);
    });
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
  updateSongTitle();
  if (isPlaying) {
    playCurrentTrack();
  }
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
  updateSongTitle();
  if (isPlaying) {
    playCurrentTrack();
  }
}

function setVolume(value) {
  const volume = isMuted ? 0 : value / 100;
  if (currentAudio) currentAudio.volume = volume;
  if (gameMusic) gameMusic.volume = volume;
}

function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById('mute-btn');
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
  
  if (currentAudio) currentAudio.volume = isMuted ? 0 : 0.5;
  if (gameMusic) gameMusic.volume = isMuted ? 0 : 0.5;
}

function switchToGameMusic(musicId) {
  if (currentAudio) {
    currentAudio.pause();
  }
  
  gameMusic = document.getElementById(musicId);
  if (gameMusic) {
    gameMusic.volume = isMuted ? 0 : 0.5;
    gameMusic.play().catch(e => console.log("Game music play failed:", e));
  }
}

function switchBackToMainMusic() {
  if (gameMusic) {
    gameMusic.pause();
    gameMusic.currentTime = 0;
    gameMusic = null;
  }
  
  if (isPlaying) {
    playCurrentTrack();
  }
}

// Character Movement
const speed = 8;

function updateCharacterPosition() {
  if (!character) return;
  
  character.style.left = gameState.character.x + 'px';
  character.style.top = gameState.character.y + 'px';
  
  // Update character direction
  const rightImg = character.querySelector('.character-right');
  const leftImg = character.querySelector('.character-left');
  
  if (gameState.character.direction === 'left') {
    rightImg.classList.add('hidden');
    leftImg.classList.remove('hidden');
  } else {
    rightImg.classList.remove('hidden');
    leftImg.classList.add('hidden');
  }
  
  // Update flower position if holding one
  if (gameState.hasFlower && flowerElement) {
    flowerElement.style.left = (gameState.character.x + 15) + 'px';
    flowerElement.style.top = (gameState.character.y - 20) + 'px';
  }
}

function isNear(x1, y1, x2, y2, range = 60) {
  return Math.abs(x1 - x2) <= range && Math.abs(y1 - y2) <= range;
}

// Generate Heart-shaped Flowers
function generateHeartFlowers() {
  const flowersContainer = document.getElementById('flowers-container');
  if (!flowersContainer) return;
  
  const centerX = 900;
  const centerY = 500;
  const scale = 15;

  for (let t = 0; t < Math.PI * 2; t += 0.3) {
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = (centerX + x) + 'px';
    flower.style.top = (centerY + y) + 'px';
    flowersContainer.appendChild(flower);
  }
}

// Update Quest Status
function updateQuestStatus() {
  const spaceStatus = document.getElementById('space-status');
  const flappyStatus = document.getElementById('flappy-status');
  const flowerStatus = document.getElementById('flower-status');
  const spaceQuest = document.getElementById('space-quest');
  const flappyQuest = document.getElementById('flappy-quest');
  const flowerQuest = document.getElementById('flower-quest');
  const spacePortal = document.getElementById('space-portal');
  const flappyPortal = document.getElementById('flappy-portal');
  
  if (spaceStatus) spaceStatus.textContent = gameState.spaceCompleted ? '✅' : '❌';
  if (flappyStatus) flappyStatus.textContent = gameState.flappyCompleted ? '✅' : '❌';
  if (flowerStatus) flowerStatus.textContent = gameState.hasFlower ? '✅' : '❌';
  
  if (gameState.spaceCompleted) {
    if (spaceQuest) spaceQuest.classList.add('completed');
    if (spacePortal) spacePortal.classList.add('completed');
  }
  if (gameState.flappyCompleted) {
    if (flappyQuest) flappyQuest.classList.add('completed');
    if (flappyPortal) flappyPortal.classList.add('completed');
  }
  if (gameState.hasFlower) {
    if (flowerQuest) flowerQuest.classList.add('completed');
  }
}

function showMessage(text) {
  alert(text);
}

function handleInteraction() {
  // Check for flower pickup
  if (!gameState.hasFlower) {
    const flowers = document.querySelectorAll('.flower');
    for (const flower of flowers) {
      const flowerX = parseInt(flower.style.left);
      const flowerY = parseInt(flower.style.top);
      if (flower.style.display !== 'none' && 
          isNear(gameState.character.x, gameState.character.y, flowerX, flowerY, 40)) {
        gameState.hasFlower = true;
        
        // Create a flower to hold
        flowerElement = document.createElement('div');
        flowerElement.className = 'flower held-flower';
        flowerElement.style.left = (gameState.character.x + 15) + 'px';
        flowerElement.style.top = (gameState.character.y - 20) + 'px';
        document.getElementById('game-container').appendChild(flowerElement);
        
        flower.style.display = 'none';
        updateQuestStatus();
        showMessage('You picked a beautiful flower! 🌹💐');
        return;
      }
    }
  }

  // Check for house interaction
  if (isNear(gameState.character.x, gameState.character.y, 600, 400, 120)) {
    if (gameState.spaceCompleted && gameState.flappyCompleted && gameState.hasFlower) {
      showLetter();
    } else {
      showMessage('Complete all quests first! 💝\n' + 
        (gameState.spaceCompleted ? '✅' : '❌') + ' Space Adventure\n' +
        (gameState.flappyCompleted ? '✅' : '❌') + ' Flying Challenge\n' +
        (gameState.hasFlower ? '✅' : '❌') + ' Collect Flower');
    }
  }

  // Check for portal interaction
  if (isNear(gameState.character.x, gameState.character.y, 240, 140, 60)) {
    if (!gameState.spaceCompleted) {
      startSpaceGame();
    }
  }
  if (isNear(gameState.character.x, gameState.character.y, 960, 140, 60)) {
    if (!gameState.flappyCompleted) {
      startFlappyGame();
    }
  }
}

// Keyboard Controls
function setupEventListeners() {
  // Music controls
  const playPauseBtn = document.getElementById('play-pause-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const muteBtn = document.getElementById('mute-btn');
  
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);

  // Start button
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBtn.style.display = 'none';
      showMessage('Welcome to Love Quest! 💖\n\nComplete both mini-games, collect a flower, then visit the house to open the love letter!');
      playCurrentTrack();
    });
  }

  // Portal click events
  const spacePortal = document.getElementById('space-portal');
  const flappyPortal = document.getElementById('flappy-portal');
  
  if (spacePortal) {
    spacePortal.addEventListener('click', () => {
      if (!gameState.spaceCompleted) {
        startSpaceGame();
      }
    });
  }

  if (flappyPortal) {
    flappyPortal.addEventListener('click', () => {
      if (!gameState.flappyCompleted) {
        startFlappyGame();
      }
    });
  }

  // Main game keyboard controls
  document.addEventListener('keydown', (e) => {
    const spaceModal = document.getElementById('space-modal');
    const flappyModal = document.getElementById('flappy-modal');
    
    if (spaceModal && spaceModal.style.display === 'flex') {
      handleSpaceGameControls(e);
      return;
    }
    if (flappyModal && flappyModal.style.display === 'flex') {
      handleFlappyGameControls(e);
      return;
    }
    
    // Main game movement controls
    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        if (gameState.character.y - speed >= 0) gameState.character.y -= speed;
        break;
      case 'arrowdown':
      case 's':
        if (gameState.character.y + speed <= 720) gameState.character.y += speed;
        break;
      case 'arrowleft':
      case 'a':
        if (gameState.character.x - speed >= 0) {
          gameState.character.x -= speed;
          gameState.character.direction = 'left';
        }
        break;
      case 'arrowright':
      case 'd':
        if (gameState.character.x + speed <= 1140) {
          gameState.character.x += speed;
          gameState.character.direction = 'right';
        }
        break;
      case 'e':
      case 'enter':
        handleInteraction();
        break;
    }
    updateCharacterPosition();
  });

  document.addEventListener('keyup', (e) => {
    const spaceModal = document.getElementById('space-modal');
    if (spaceModal && spaceModal.style.display === 'flex') {
      spaceGame.keys[e.key.toLowerCase()] = false;
    }
  });

  // Flappy game click control
  const flappyGame = document.getElementById('flappy-game');
  if (flappyGame) {
    flappyGame.addEventListener('click', () => {
      const flappyModal = document.getElementById('flappy-modal');
      if (flappyModal && flappyModal.style.display === 'flex') {
        flapBird();
      }
    });
  }
}

// Space Game
let spaceGame = {
  spaceship: { x: 370 },
  bullets: [],
  asteroids: [],
  score: 0,
  lives: 3,
  gameLoop: null,
  keys: {},
  lastShot: 0,
  running: false
};

function startSpaceGame() {
  const spaceModal = document.getElementById('space-modal');
  if (spaceModal) {
    spaceModal.style.display = 'flex';
    switchToGameMusic('space-music');
    
    // Show start screen
    const startScreen = document.getElementById('space-start-screen');
    if (startScreen) {
      startScreen.style.display = 'flex';
    }
  }
}

function startSpaceGameplay() {
  const startScreen = document.getElementById('space-start-screen');
  if (startScreen) {
    startScreen.style.display = 'none';
  }
  
  resetSpaceGame();
  spaceGame.running = true;
  spaceGameLoop();
}

function resetSpaceGame() {
  spaceGame.spaceship.x = 370;
  spaceGame.bullets = [];
  spaceGame.asteroids = [];
  spaceGame.score = 0;
  spaceGame.lives = 3;
  spaceGame.keys = {};
  spaceGame.lastShot = 0;
  spaceGame.running = false;
  
  if (spaceGame.gameLoop) {
    cancelAnimationFrame(spaceGame.gameLoop);
    spaceGame.gameLoop = null;
  }
  
  // Clear existing elements
  const spaceGameDiv = document.getElementById('space-game');
  if (spaceGameDiv) {
    spaceGameDiv.querySelectorAll('.bullet, .asteroid, .star, .game-complete').forEach(el => el.remove());
    
    // Add stars
    for (let i = 0; i < 50; i++) {
      createStar();
    }
  }
  
  updateSpaceUI();
}

function createStar() {
  const spaceGameDiv = document.getElementById('space-game');
  if (!spaceGameDiv) return;
  
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = Math.random() * 800 + 'px';
  star.style.top = Math.random() * 600 + 'px';
  star.style.animationDelay = Math.random() * 2 + 's';
  spaceGameDiv.appendChild(star);
}

function spaceGameLoop() {
  if (!spaceGame.running) return;
  
  const spaceship = document.getElementById('spaceship');
  if (!spaceship) return;
  
  // Move spaceship
  if (spaceGame.keys['a'] && spaceGame.spaceship.x > 0) {
    spaceGame.spaceship.x -= 5;
  }
  if (spaceGame.keys['d'] && spaceGame.spaceship.x < 740) {
    spaceGame.spaceship.x += 5;
  }
  
  spaceship.style.left = spaceGame.spaceship.x + 'px';

  // Move bullets
  for (let i = spaceGame.bullets.length - 1; i >= 0; i--) {
    const bullet = spaceGame.bullets[i];
    bullet.y -= 8;
    bullet.element.style.top = bullet.y + 'px';
    
    if (bullet.y < 0) {
      bullet.element.remove();
      spaceGame.bullets.splice(i, 1);
    }
  }

  // Move asteroids
  for (let i = spaceGame.asteroids.length - 1; i >= 0; i--) {
    const asteroid = spaceGame.asteroids[i];
    asteroid.y += asteroid.speed;
    asteroid.element.style.top = asteroid.y + 'px';
    
    if (asteroid.y > 600) {
      asteroid.element.remove();
      spaceGame.asteroids.splice(i, 1);
    }
    
    // Check collision with spaceship
    if (Math.abs(asteroid.x - spaceGame.spaceship.x - 30) < 30 && 
        Math.abs(asteroid.y - 530) < 30) {
      asteroid.element.remove();
      spaceGame.asteroids.splice(i, 1);
      spaceGame.lives--;
      updateSpaceUI();
      
      if (spaceGame.lives <= 0) {
        endSpaceGame(false);
        return;
      }
    }
  }

  // Check bullet-asteroid collisions
  for (let i = spaceGame.bullets.length - 1; i >= 0; i--) {
    const bullet = spaceGame.bullets[i];
    for (let j = spaceGame.asteroids.length - 1; j >= 0; j--) {
      const asteroid = spaceGame.asteroids[j];
      if (Math.abs(bullet.x - asteroid.x) < 25 && 
          Math.abs(bullet.y - asteroid.y) < 25) {
        bullet.element.remove();
        asteroid.element.remove();
        spaceGame.bullets.splice(i, 1);
        spaceGame.asteroids.splice(j, 1);
        spaceGame.score++;
        updateSpaceUI();
        
        if (spaceGame.score >= 15) {
          endSpaceGame(true);
          return;
        }
        break;
      }
    }
  }

  // Spawn asteroids
  if (Math.random() < 0.02) {
    createAsteroid();
  }

  spaceGame.gameLoop = requestAnimationFrame(spaceGameLoop);
}

function createAsteroid() {
  const spaceGameDiv = document.getElementById('space-game');
  if (!spaceGameDiv) return;
  
  const asteroid = document.createElement('div');
  asteroid.className = 'asteroid';
  const size = 20 + Math.random() * 30;
  asteroid.style.width = size + 'px';
  asteroid.style.height = size + 'px';
  
  const x = Math.random() * (800 - size);
  asteroid.style.left = x + 'px';
  asteroid.style.top = '0px';
  
  spaceGameDiv.appendChild(asteroid);
  
  spaceGame.asteroids.push({
    element: asteroid,
    x: x + size/2,
    y: 0,
    speed: 2 + Math.random() * 3
  });
}

function handleSpaceGameControls(e) {
  spaceGame.keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    shootBullet();
  }
}

function shootBullet() {
  const now = Date.now();
  if (now - spaceGame.lastShot < 300) return;
  
  spaceGame.lastShot = now;
  
  const spaceGameDiv = document.getElementById('space-game');
  if (!spaceGameDiv) return;
  
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = (spaceGame.spaceship.x + 28) + 'px';
  bullet.style.top = '490px';
  spaceGameDiv.appendChild(bullet);
  
  spaceGame.bullets.push({
    element: bullet,
    x: spaceGame.spaceship.x + 30,
    y: 490
  });
}

function updateSpaceUI() {
  const scoreEl = document.getElementById('space-score');
  const livesEl = document.getElementById('space-lives');
  
  if (scoreEl) scoreEl.textContent = spaceGame.score;
  if (livesEl) livesEl.textContent = spaceGame.lives;
}

function endSpaceGame(won) {
  spaceGame.running = false;
  if (spaceGame.gameLoop) {
    cancelAnimationFrame(spaceGame.gameLoop);
    spaceGame.gameLoop = null;
  }
  
  const gameDiv = document.getElementById('space-game');
  if (!gameDiv) return;
  
  const completeDiv = document.createElement('div');
  completeDiv.className = 'game-complete';
  
  if (won) {
    completeDiv.innerHTML = `
      <h2>🎉 Mission Complete!</h2>
      <p>You've mastered the stars! 🌟</p>
      <button class="continue-btn" onclick="completeSpaceQuest()">Continue Love Quest</button>
    `;
  } else {
    completeDiv.innerHTML = `
      <h2>💥 Mission Failed!</h2>
      <p>Don't give up! Try again! 🚀</p>
      <button class="continue-btn" onclick="startSpaceGameplay()">Retry</button>
      <button class="continue-btn" onclick="closeSpaceGame()">Exit</button>
    `;
  }
  
  gameDiv.appendChild(completeDiv);
}

function completeSpaceQuest() {
  gameState.spaceCompleted = true;
  updateQuestStatus();
  closeSpaceGame();
  showMessage('Space quest completed! 🚀⭐');
}

function closeSpaceGame() {
  const spaceModal = document.getElementById('space-modal');
  if (spaceModal) {
    spaceModal.style.display = 'none';
  }
  
  switchBackToMainMusic();
  spaceGame.running = false;
  
  if (spaceGame.gameLoop) {
    cancelAnimationFrame(spaceGame.gameLoop);
    spaceGame.gameLoop = null;
  }
  
  // Show start screen again
  const startScreen = document.getElementById('space-start-screen');
  if (startScreen) {
    startScreen.style.display = 'flex';
  }
}

// Flappy Game
let flappyGame = {
  bird: { y: 250, velocity: 0 },
  pipes: [],
  score: 0,
  gameLoop: null,
  gameRunning: false,
  lastPipe: 0
};

function startFlappyGame() {
  const flappyModal = document.getElementById('flappy-modal');
  if (flappyModal) {
    flappyModal.style.display = 'flex';
    switchToGameMusic('flappy-music');
    
    // Show start screen
    const startScreen = document.getElementById('flappy-start-screen');
    if (startScreen) {
      startScreen.style.display = 'flex';
    }
  }
}

function startFlappyGameplay() {
  const startScreen = document.getElementById('flappy-start-screen');
  if (startScreen) {
    startScreen.style.display = 'none';
  }
  
  resetFlappyGame();
  flappyGame.gameRunning = true;
  flappyGameLoop();
}

function resetFlappyGame() {
  flappyGame.bird = { y: 250, velocity: 0 };
  flappyGame.pipes = [];
  flappyGame.score = 0;
  flappyGame.gameRunning = false;
  flappyGame.lastPipe = Date.now();
  
  if (flappyGame.gameLoop) {
    cancelAnimationFrame(flappyGame.gameLoop);
    flappyGame.gameLoop = null;
  }
  
  // Clear existing elements
  const flappyGameDiv = document.getElementById('flappy-game');
  if (flappyGameDiv) {
    flappyGameDiv.querySelectorAll('.pipe, .cloud, .game-complete').forEach(el => el.remove());
    
    // Add clouds
    for (let i = 0; i < 5; i++) {
      createCloud();
    }
  }
  
  updateFlappyUI();
}

function createCloud() {
  const flappyGameDiv = document.getElementById('flappy-game');
  if (!flappyGameDiv) return;
  
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  cloud.style.width = (40 + Math.random() * 60) + 'px';
  cloud.style.height = (20 + Math.random() * 30) + 'px';
  cloud.style.left = '800px';
  cloud.style.top = Math.random() * 300 + 'px';
  flappyGameDiv.appendChild(cloud);
}

function flappyGameLoop() {
  if (!flappyGame.gameRunning) return;

  const bird = document.getElementById('bird');
  if (!bird) return;

  // Update bird physics
  flappyGame.bird.velocity += 0.3;
  flappyGame.bird.y += flappyGame.bird.velocity;
  
  bird.style.top = flappyGame.bird.y + 'px';

  // Check boundaries
  if (flappyGame.bird.y <= 0 || flappyGame.bird.y >= 560) {
    endFlappyGame(false);
    return;
  }

  // Move pipes
  for (let i = flappyGame.pipes.length - 1; i >= 0; i--) {
    const pipe = flappyGame.pipes[i];
    pipe.x -= 2;
    pipe.topElement.style.left = pipe.x + 'px';
    pipe.bottomElement.style.left = pipe.x + 'px';
    
    // Score when passing pipe
    if (!pipe.scored && pipe.x + 60 < 100) {
      pipe.scored = true;
      flappyGame.score++;
      updateFlappyUI();
      
      if (flappyGame.score >= 3) {
        endFlappyGame(true);
        return;
      }
    }
    
    // Remove off-screen pipes
    if (pipe.x < -60) {
      pipe.topElement.remove();
      pipe.bottomElement.remove();
      flappyGame.pipes.splice(i, 1);
    }
    
    // Check collision
    if (pipe.x < 140 && pipe.x + 60 > 100) {
      if (flappyGame.bird.y < pipe.gap || flappyGame.bird.y + 40 > pipe.gap + 200) {
        endFlappyGame(false);
        return;
      }
    }
  }

  // Spawn pipes
  const now = Date.now();
  if (now - flappyGame.lastPipe > 2000) {
    createPipe();
    flappyGame.lastPipe = now;
  }

  flappyGame.gameLoop = requestAnimationFrame(flappyGameLoop);
}

function createPipe() {
  const flappyGameDiv = document.getElementById('flappy-game');
  if (!flappyGameDiv) return;
  
  const gapY = 100 + Math.random() * 250;
  const pipeX = 800;
  
  // Top pipe
  const topPipe = document.createElement('div');
  topPipe.className = 'pipe';
  topPipe.style.left = pipeX + 'px';
  topPipe.style.top = '0px';
  topPipe.style.height = gapY + 'px';
  flappyGameDiv.appendChild(topPipe);
  
  // Bottom pipe
  const bottomPipe = document.createElement('div');
  bottomPipe.className = 'pipe';
  bottomPipe.style.left = pipeX + 'px';
  bottomPipe.style.bottom = '0px';
  bottomPipe.style.height = (600 - gapY - 200) + 'px';
  flappyGameDiv.appendChild(bottomPipe);
  
  flappyGame.pipes.push({
    x: pipeX,
    gap: gapY,
    topElement: topPipe,
    bottomElement: bottomPipe,
    scored: false
  });
}

function handleFlappyGameControls(e) {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    flapBird();
  }
}

function flapBird() {
  if (flappyGame.gameRunning) {
    flappyGame.bird.velocity = -8;
  }
}

function updateFlappyUI() {
  const scoreEl = document.getElementById('flappy-score');
  if (scoreEl) scoreEl.textContent = flappyGame.score;
}

function endFlappyGame(won) {
  flappyGame.gameRunning = false;
  if (flappyGame.gameLoop) {
    cancelAnimationFrame(flappyGame.gameLoop);
    flappyGame.gameLoop = null;
  }
  
  const gameDiv = document.getElementById('flappy-game');
  if (!gameDiv) return;
  
  const completeDiv = document.createElement('div');
  completeDiv.className = 'game-complete';
  
  if (won) {
    completeDiv.innerHTML = `
      <h2>🎉 Flight Complete!</h2>
      <p>You've mastered the skies! 🐦</p>
      <button class="continue-btn" onclick="completeFlappyQuest()">Continue Love Quest</button>
    `;
  } else {
    completeDiv.innerHTML = `
      <h2>💥 Flight Failed!</h2>
      <p>Don't give up! Try again! 🐦</p>
      <button class="continue-btn" onclick="startFlappyGameplay()">Retry</button>
      <button class="continue-btn" onclick="closeFlappyGame()">Exit</button>
    `;
  }
  
  gameDiv.appendChild(completeDiv);
}

function completeFlappyQuest() {
  gameState.flappyCompleted = true;
  updateQuestStatus();
  closeFlappyGame();
  showMessage('Flying quest completed! 🐦💫');
}

function closeFlappyGame() {
  const flappyModal = document.getElementById('flappy-modal');
  if (flappyModal) {
    flappyModal.style.display = 'none';
  }
  
  switchBackToMainMusic();
  flappyGame.gameRunning = false;
  
  if (flappyGame.gameLoop) {
    cancelAnimationFrame(flappyGame.gameLoop);
    flappyGame.gameLoop = null;
  }
  
  // Show start screen again
  const startScreen = document.getElementById('flappy-start-screen');
  if (startScreen) {
    startScreen.style.display = 'flex';
  }
}

// Letter Modal Functions
function showLetter() {
  const letterModal = document.getElementById('letter-modal');
  if (letterModal) {
    letterModal.classList.remove('hidden');
  }
}

function answerYes() {
  const letterModal = document.getElementById('letter-modal');
  if (letterModal) {
    letterModal.classList.add('hidden');
  }
  
  // Celebrate with falling flowers
  const flowers = document.querySelectorAll('.flower');
  flowers.forEach((flower, index) => {
    setTimeout(() => {
      flower.classList.add('falling');
    }, index * 100);
  });
  
  // Show success message
  setTimeout(() => {
    showMessage('🎉 YES! 💕 You have completed the Love Quest! 🌹💖\n\nThank you for this magical journey! ✨');
  }, 1000);
}

function answerNo() {
  gameState.attempts++;
  const letterModal = document.getElementById('letter-modal');
  if (letterModal) {
    letterModal.classList.add('hidden');
  }
  
  if (gameState.attempts >= 3) {
    showMessage('💔 Maybe next time... The love quest continues! 🌹');
  } else {
    showMessage('🤔 Take your time to think about it... 💭\nThe house will be here when you\'re ready! 🏠💕');
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  initGame();
});

// Prevent scrolling with arrow keys
document.addEventListener('keydown', (e) => {
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
}, { passive: false });