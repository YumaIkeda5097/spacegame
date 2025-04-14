// Canvas設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム要素
const center = { x: canvas.width / 2, y: canvas.height / 2 };
let ball = { x: center.x, y: center.y, radius: 15 };
let obstacles = [];
let score = 0;
let level = 1;
let baseSpeed = 1.5;

// 画像の読み込み
const bgImage = new Image();
bgImage.src = "assets/space_background.jpg";
const ballImage = new Image();
ballImage.src = "assets/meteor.png";
const obstacleImage = new Image();
obstacleImage.src = "assets/space_debris.png";

// 背景の描画
function drawBackground() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// ボールの描画
function drawBall() {
  ctx.drawImage(
    ballImage,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
  );
}

// 障害物の描画
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(
      obstacleImage,
      obstacle.x - obstacle.width / 2,
      obstacle.y - obstacle.height / 2,
      obstacle.width,
      obstacle.height
    );
  });
}

// スコアとレベルの表示
function drawScoreAndLevel() {
  ctx.font = "20px 'Arial'";
  ctx.fillStyle = "#FFD700"; // ゴールド
  ctx.fillText(`スコア: ${score}`, 10, 30);
  ctx.fillText(`レベル: ${level}`, 10, 60);
}

// タッチ入力でボールを移動
canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);

function handleTouch(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();

  // タッチ位置をCanvas座標系に変換
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  // ボールをタッチ位置に移動
  ball.x = touchX;
  ball.y = touchY;
}

// 障害物の生成
function createObstacle() {
  const edge = Math.floor(Math.random() * 4); // 0: 上, 1: 下, 2: 左, 3: 右
  let x, y;

  switch (edge) {
    case 0: // 上
      x = Math.random() * canvas.width;
      y = -50;
      break;
    case 1: // 下
      x = Math.random() * canvas.width;
      y = canvas.height + 50;
      break;
    case 2: // 左
      x = -50;
      y = Math.random() * canvas.height;
      break;
    case 3: // 右
      x = canvas.width + 50;
      y = Math.random() * canvas.height;
      break;
  }

  obstacles.push({
    x,
    y,
    width: 40,
    height: 40,
    speedX: (center.x - x) / 100,
    speedY: (center.y - y) / 100,
  });
}

// 障害物の移動
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.x += obstacle.speedX * baseSpeed;
    obstacle.y += obstacle.speedY * baseSpeed;

    // ボールとの衝突判定
    if (
      ball.x > obstacle.x - obstacle.width / 2 &&
      ball.x < obstacle.x + obstacle.width / 2 &&
      ball.y > obstacle.y - obstacle.height / 2 &&
      ball.y < obstacle.y + obstacle.height / 2
    ) {
      endGame();
    }
  });
}

// レベルアップ
function checkLevelUp() {
  if (score > 0 && score % 50 === 0) {
    level++;
    baseSpeed += 0.5;
  }
}

// ゲーム終了
function endGame() {
  alert(`ゲームオーバー！スコア: ${score}`);
  score = 0;
  level = 1;
  baseSpeed = 1.5;
  obstacles = [];
}

// ゲームの描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBall();
  drawObstacles();
  drawScoreAndLevel();
}

// メインループ
function gameLoop() {
  updateObstacles();
  draw();
  requestAnimationFrame(gameLoop);
}

// 一定間隔で障害物を生成
setInterval(() => {
  createObstacle();
  score += 10;
  checkLevelUp();
}, 1500);

// ゲーム開始
gameLoop();
