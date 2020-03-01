var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// GameBoard
canvas.width = 800;
canvas.height = 450;

// Theme
var theme = {
  ballColor: '#74546A',
  paddleColor: '#0B032D',
  brickColor: '#348C93',
  statColor: '#FFB997'
};

// Ball
var ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 20,
  dx: 2,
  dy: -2
};

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  context.fillStyle = theme.ballColor;
  context.fill();
  context.closePath();
}

// Paddle
var paddle = {
  width: 100,
  height: 10,
  x: (canvas.width - 100) / 2,
  y: canvas.height - 10
};

function drawPaddle() {
  context.fillStyle = theme.paddleColor;
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

// Controls
var rightPressed = false;
var leftPressed = false;
var playing = false;

document.addEventListener('keydown', event => {
  if(event.keyCode == 39) { rightPressed = true; }
  if(event.keyCode == 37) { leftPressed = true; }
});

document.addEventListener('keyup', event => {
  if(event.keyCode == 39) { rightPressed = false; }
  if(event.keyCode == 37) { leftPressed = false; }
  if(event.keyCode == 32) { playing = true; }
});

// Statistics
var score = 0;
var lives = 3;

function drawStats() {
  context.font = '16px Roboto';
  context.fillStyle = theme.statColor;
  context.fillText('Score: ' + score, 8, 20);
  context.fillText('Lives: ' + lives, canvas.width - 70, 20);
}

// Bricks
var wall = {
  rows: 3,
  cols: 7,
  offset: {
    top: 30,
    left: 30
  },
  brick: {
    width: 98,
    height: 30,
    padding: 10
  }
};

var bricks = [];

function createBricks() {
  for (c = 0; c < wall.cols; c++) {
    bricks[c] = [];
    for (r = 0; r < wall.rows; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

createBricks();

function drawBricks() {
  for (c = 0; c < wall.cols; c++) {
    for (r = 0; r < wall.rows; r++) {
      if (bricks[c][r].status == 1) {

        var brickX = c * (wall.brick.width + wall.brick.padding) + wall.offset.left;
        var brickY = r * (wall.brick.height + wall.brick.padding) + wall.offset.top;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        context.beginPath();
        context.rect(brickX, brickY, wall.brick.width, wall.brick.height);
        context.fillStyle = theme.brickColor;
        context.fill();
        context.closePath();

      }
    }
  }
}

// Brick collision detection
function brickCollision() {
  for (c = 0; c < wall.cols; c++) {
    for (r = 0; r < wall.rows; r++) {
      var brick = bricks[c][r];

      if (brick.status == 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + wall.brick.width &&
          ball.y > brick.y &&
          ball.y < brick.y + wall.brick.height
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          // update score
          score++;
          if (score == wall.rows * wall.cols) {
            alert('You win!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Reset
function reset() {
  // Reset ball position
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 20;
  // Reset paddle position
  paddle.x = (canvas.width - 100) / 2;
  // Stop game
  playing = false;
  // Update stats
  if(lives !== 1) {
    lives--;
  } else {
    // No more lives restart game
    createBricks();
    score = 0;
    lives = 3;
  }
}

// Run
function run() {
  // Clear frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawStats();
  drawBall();
  drawPaddle();
  drawBricks();
  brickCollision();

  // Gameboard collision
  if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
    ball.dx = -ball.dx;
  }

  if (ball.y < ball.radius) {
    ball.dy = -ball.dy;
  }

  if (ball.y > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      // we missed
      reset();
    }
  }

  // Move paddle
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
    if (!playing) {
      ball.x += 7;
    }
  }

  if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
    if (!playing) {
      ball.x -= 7;
    }
  }

  // Move ball
  if (playing) {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  requestAnimationFrame(run);
}

run();
