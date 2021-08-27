// declare variables
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;

var paddle1Y = 250;
var paddle2Y = 250;
// score of each player
var player1 = 0;
var player2 = 0;
// declare variable to support changing speed
var ballSpeedX = 10;
var ballSpeedY = 4;
// when condition win is declared
var showingWinScreen = false;

// constant variable
const PADDLE_HEIGHT = 120;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;

// a function to handle every time the mouse moves
function calculateMousePos(evt) {
	// we got the black rect like what we got the canvas
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	// return two pair variables
	return {
		x:mouseX,
		y:mouseY
	};
}

// ask player if they want to continue play
function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1 = 0;
		player2 = 0;
		showingWinScreen = false;
	}
}

// main execute function
window.onload = function() {

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// loops to make the motion of ball as well as paddle
	var framePerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framePerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	// when the action happens pass into to the function
	// execute to get the mouse x postion and the y pos of 
	// coordinate also update the value of Y to paddleY
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			// make the mouse point at the center
			// of the paddle
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}

// reset the ball when it reach the end of canvas
function ballReset() {

	if (player1 == WINNING_SCORE || player2 == WINNING_SCORE) {
		showingWinScreen = true;
	}

	// change the direction of the ball
	ballSpeedX = - ballSpeedX;
	ballX = canvas.height/2;
	ballY = canvas.height/2;
}

// motion of the paddle of computer
function computerMovement() {

	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	// minite - 35 in order to ignore the chasing the ball
	// while within 35 pixels above or below
	if (paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + 35){
		paddle2Y -= 6;
	}
} 
// motion of the paddle control by player
function moveEverything() {

	// stop the game if either win
	if (showingWinScreen) {
		return;
	}

	computerMovement();
	// make the ball move to the right
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// if the ball crossing the left side
	if (ballX < 0) {
		// if ball below the top paddle and
		// above the bottom of the paddle
		if (ballY > paddle1Y &&
			ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = - ballSpeedX;
			// to make the ball bounce at a dirrent angle
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		// if not touch the paddle -> reset and add score
		} else {
			player2++; // must be before ballReset() for win condition
			ballReset();
		}
	} 
	// if the ball crossing the right side
	if (ballX > canvas.width) {
		if (ballY > paddle2Y &&
			ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = - ballSpeedX;
			var deltaY = ballY - (paddle22Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1++;
			ballReset();
		}
	}
	// for y coordinate
	if (ballY < 0) {
		ballSpeedY = - ballSpeedY;
	}
	if (ballY > canvas.height) {
		ballSpeedY = - ballSpeedY;
	} 
}

function drawNet() {

	for(var i = 0; i < canvas.height; i+= 40) {
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}

// draw all the needed shapes
function drawEverything() {

	// color of the canvas (always come together)
	// canvasContext.fillStyle = 'black';
	// // declare the canvas box size
	// // from left to right is 0 px from the left
	// // 0 px from the top, canvas width, and canvas height	
	// canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	// // practise draw a center box
	// // canvasContext.fillStyle = 'white';
	// // since the box is declare from top left corner
	// // so we take 400 (half of width) - 100 same with height to 
	// // get centered
	// // canvasContext.fillRect(300,200,200,200)

	// // draw the paddle
	// canvasContext.fillStyle = 'white';
	// canvasContext.fillRect(0, 210, 10, 100);

	// // draw the ball 
	// canvasContext.fillStyle = 'white';
	// canvasContext.fillRect(ballX, 100, 10, 10);

	// canvas
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	// stop the game
	if (showingWinScreen) {
		canvasContext.font = "40px Times New Roman";
		canvasContext.fillStyle = 'red';
		if (player1 >= WINNING_SCORE) {
			canvasContext.fillStyle = 'yellow';
			canvasContext.font ="60px Times new Roman";
			canvasContext.fillText("Player 1 Won!!", canvas.width/2-160, 200);
		} else if (player2 >= WINNING_SCORE) {
			canvasContext.fillStyle = 'yellow';
			canvasContext.font ="60px Times new Roman";
			canvasContext.fillText("Player 2 Won!!", canvas.width/2-160, 200);
		}
		canvasContext.font = "40px Times New Roman";
		canvasContext.fillStyle = 'red';
		canvasContext.fillText("Click to Continue", canvas.width/2 - 120, canvas.height/2 + 100);
		return;
	}
	drawNet();	
	// paddle of the left player
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	// paddle of the right computer player
	colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	// ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.font = "10px Times New Roman";
	canvasContext.fillText("Player 1", 180, 100);
	canvasContext.fillText(player1, 195, 150);
	canvasContext.fillText("Player 2", canvas.width - 210, 100)
	canvasContext.fillText(player2, canvas.width - 195, 150);
}

// declare function to draw the needed shaped
function colorRect(leftX, topY, width, height, drawColor) {
	
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

// draw the tennis ball
function colorCircle(centerX, centerY, radius, drawColor) {
	// ball
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	// arc (center, from top to bottom, r, angle, clockwise/backward) x: center of circle
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();	
}