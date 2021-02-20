document.addEventListener('DOMContentLoaded', () => {
  const bird = document.querySelector('.bird');
  const gameDisplay = document.querySelector('.game-container');
  const ground = document.querySelector('.ground');

  const birdLeft = 220;
  let birdBottom = 300;
  const gravity = 3;
  let isGameOver = false;

  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
  }
  let gameTimerId = setInterval(startGame, 20);

  function jump() {
    if (birdBottom < 650) birdBottom += 50;
    bird.style.bottom = birdBottom + 'px';
    console.log(birdBottom);
  }

  function control(e) {
    if (e.keyCode === 32) {
      jump();
    }
  }

  function gameOver() {
    clearInterval(gameTimerId);
    console.log('Game Over!')
    isGameOver = true;
    document.removeEventListener('keyup', control);
  }

  document.addEventListener('keyup', control);
  function generateObstacle() {
    let obstacleLeft = 500;
    const gap = 450;
    const randomHeight = Math.random() * 100;
    const obstacleBottom = randomHeight;
    const topObstacleBottom = randomHeight + gap;
    const obstacle = document.createElement('div');
    const topObstacle = document.createElement('div');

    if (!isGameOver) {
      obstacle.classList.add('obstacle');
      topObstacle.classList.add('obstacle-top');
    }

    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);

    obstacle.style.left = obstacleLeft + 'px';
    obstacle.style.bottom = obstacleBottom + 'px';

    topObstacle.style.left = obstacleLeft + 'px';
    topObstacle.style.bottom = topObstacleBottom + 'px';

    function moveObstacle() {
      obstacleLeft -= 2;
      topObstacle.style.left = obstacleLeft + 'px';
      obstacle.style.left = obstacleLeft + 'px';

      if (obstacleLeft === -60) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }

      if (((obstacleLeft < 275 && obstacleLeft > 175 && birdLeft === 220)
        && (birdBottom < (obstacleBottom + 300) || birdBottom > (topObstacleBottom - 50)))
        || birdBottom < 155) {
        gameOver();
        clearInterval(timerId);
      }
    }
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) setTimeout(generateObstacle, 3000);
  }
  generateObstacle();
});