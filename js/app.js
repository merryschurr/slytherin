window.onload = function()
{
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    score = 0,
    level = 1,
    direction = 0,
    snake = new Array(3),
    active = true,
    speed = 300;

    // matrix
    var map = new Array(40);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(40);
    }

    canvas.width = 404;
    canvas.height = 424;

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    // snake
    map = generateSnake(map);

    // food
    map = generateFood(map);

    drawGame();

    window.addEventListener('keydown', function(e) {
    	event.preventDefault();
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });

    function drawGame() 
    {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // add to snake body
        for (var i = snake.length - 1; i >= 0; i--) {

            // collision detection
            if (i === 0) {
                switch(direction) {
                    case 0: // Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }

                // out of bounds/edge of matrix 
                if (snake[0].x < 0 || 
                    snake[0].x >= 40 ||
                    snake[0].y < 0 ||
                    snake[0].y >= 40) {
                    showGameOver();
                    return;
                }

                // add body to snake when food is ate, and add body to snake
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);

                    // add body to snake
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                    // increase levels by 50
                    if ((score % 50) == 0) {
                        level += 1;
                    }
                
                // end game if body runs into body
                } else if (map[snake[0].x][snake[0].y] === 2) {
                    showGameOver();
                    return;
                }

                map[snake[0].x][snake[0].y] = 2;
            } else {
                // move old body to add new body
                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }

                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }

        // border and score board
        drawMain();

        // matrix cycle with body and food size
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 1) {
                    ctx.fillStyle = '#d9534f';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
                } else if (map[x][y] === 2) {
                    ctx.fillStyle = '#2d9c4c';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);          
                }
            }
        }
        
        if (active) {
            setTimeout(drawGame, speed - (level * 50));
        }
    }


    function drawMain() 
    {
        ctx.lineWidth = 6; // border thickness
        ctx.strokeStyle = '#2d9c4c'; // border color

        // border padding 
        ctx.strokeRect(2, 20, canvas.width - 2, canvas.height - 22);

        ctx.fillStyle = '#d9534f';
        ctx.font = '18px sans-serif';
        ctx.fillText('Score: ' + score + ' - Level: ' + level, 100, 12);
    }

    function generateFood(map)
    {
        // create random position for rows and columns
        var rndmX = Math.round(Math.random() * 19),
            rndmY = Math.round(Math.random() * 19);
        
        // move food to random place avoiding body
        while (map[rndmX][rndmY] === 2) {
            rndmX = Math.round(Math.random() * 19);
            rndmY = Math.round(Math.random() * 19);
        }
        
        map[rndmX][rndmY] = 1;

        return map;
    }

    function generateSnake(map)
    {
        // random position for head of snake
        var rndmX = Math.round(Math.random() * 19),
            rndmY = Math.round(Math.random() * 19);

        // snake position vs border location
        while ((rndmX - snake.length) < 0) {
            rndmX = Math.round(Math.random() * 19);
        }
        
        for (var i = 0; i < snake.length; i++) {
            snake[i] = { x: rndmX - i, y: rndmY };
            map[rndmX - i][rndmY] = 2;
        }

        return map;
    }

    function showGameOver()
    {
        // game over
        active = false;

        // clear board
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#d9534f';
        ctx.font = '30px sans-serif';
        
        ctx.fillText('Syltherin Loses!', ((canvas.width / 2) - (ctx.measureText('Syltherin Loses!').width / 2)), 180);

        ctx.font = '20px sans-serif';

        ctx.fillText('Total Points: ' + score, ((canvas.width / 2) - (ctx.measureText('Total Points: ' + score).width / 2)), 200);
        
    }
};