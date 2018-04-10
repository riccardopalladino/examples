var mouse = null;

var enemies = [];
var enemyIntervalId = null;

var goals = [];
var goal_index = 0;

var goalIntervalId = null;

var windowSize = {'height': $(window).height(), 
				  'width': $(window).width()};
var time = 0;
var points = 0;

var timeReference = null;
var pointsReference = null;

$(document).ready(function() {
    
	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
	        if((mouse.pos.left-MOUSE_STEP) > 0){
		        mouse.pos.left-= MOUSE_STEP;
		        mouse.css({"left": mouse.pos.left+"px"});
	    	}
	        break;

	        case 38: // up
	        if((mouse.pos.top-MOUSE_STEP) > 0){
		        mouse.pos.top-= MOUSE_STEP;
		        mouse.css({"top": mouse.pos.top+"px"});
	        }
	        break;

	        case 39: // right
	        if((mouse.pos.left+MOUSE_STEP) < windowSize.width){
		        mouse.pos.left+=MOUSE_STEP;
		        mouse.css({"left": mouse.pos.left+"px"});
	        }
	        break;

	        case 40: // down
	        if((mouse.pos.top+MOUSE_STEP) < windowSize.height){
		        mouse.pos.top+=MOUSE_STEP;
		        mouse.css({"top": mouse.pos.top+"px"});
	        }
	        break;

	        default: return; // exit this handler for other keys
	    }
	    //console.log("Mouse. " + logPosition(pos));
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	    mouse.goalCollision();
	});

	console.log( "ready!" );
	startGame();
});

function startGame(){
	$('body').html("<div>Points: <span id='points'>0</span></div><br /><div>Times: <span id='clock'>0</span></div>");
	timeReference = $(TIME_SELECTOR);
    pointsReference = $(POINTS_SELECTOR);
	mouse = new Mouse();
	$.extend(mouse, $('#mouse'));
    //console.log("Window size: " + windowSize.height + " " + windowSize.width);
    //console.log("Init position: " + mouse.pos.top + " " + mouse.pos.left);
	initEnemy(ENEMY_RANDOM, ENEMY_HUNTER);
	enemyIntervalId = setInterval(moveEnemy, ENEMY_TIME);
	goalIntervalId = setInterval(createGoal, GOAL_TIME);
	timeIntervalId = setInterval(clock, 1000);
};

function newGame(){
	reset();
	startGame();
};

function reset(){
	clearInterval(enemyIntervalId);
	clearInterval(goalIntervalId);
	clearInterval(timeIntervalId);
	$('body').empty();
	enemies = [];
	goals = [];
	goal_index = 0;
	mouse = null;
	points = 0;
	time = 0;
};

