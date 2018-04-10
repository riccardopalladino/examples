var mouse = null;
var MOUSE_STEP = 5;
var MOUSE_SIZE = {height : 50, width: 50};
var ENEMY_STEP = 5;
var NUM_ENEMY = 1;
var ENEMY_RANDOM = 0;
var ENEMY_TIME = 200;
var ENEMY_SIZE = {height: 50, width: 50};
var ENEMY_HUNTER = 1;
var enemies = [];
var enemyIntervalId = null;
var goals = [];
var goal_index = 0;
var GOAL_TYPE = [{type: 'cheese',
				  value: 50}];
var goalIntervalId = null;
var GOAL_TIME = 10000;
var GOAL_SIZE = {height: 30, width: 30};

var windowSize = {'height': $(window).height(), 
				  'width': $(window).width()};
var LOSE_MESSAGE = "YOU LOSE BITCH!";

var time = 0;
var points = 0;

var TIME_SELECTOR = '#clock';
var POINTS_SELECTOR = '#points';

var timeReference = null;
var pointsReference = null;

$( document ).ready(function() {
    
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
	timeReference = $(TIME_SELECTOR);
    pointsReference = $(POINTS_SELECTOR);
	console.log( "ready!" );
	startGame();
});

function logPosition(position){
	return "Current position: "+ position.top +" "+ position.left;
};

function Goal (id, goal){
	this.pos = {top: Math.floor(Math.random()*windowSize.height),
		   left: Math.floor(Math.random()*windowSize.width)};
    $.extend(this.pos, GOAL_SIZE);
	this.type = goal.type;
	this.value = goal.value;
	this.img = $('<img />');
	this.img.attr('src',this.type+'.png');
	this.img.attr('id','goal'+id);
	this.id = id;
	this.img.css({
		height: GOAL_SIZE.height+"px", 
		width: GOAL_SIZE.width+"px",
		position: "absolute",
		top: this.pos.top+"px",
    	left: this.pos.left+"px"
    });
	$('body').append(this.img);
};

function createGoal(){
	var goal = GOAL_TYPE[0];
	goals.push(new Goal(goal_index++,goal));
}

function Mouse(){
	this.pos = {top: Math.floor(Math.random()*windowSize.height),
		   left: Math.floor(Math.random()*windowSize.width)};
	$.extend(this.pos, MOUSE_SIZE);
	this.img = $('<img />');
	this.img.attr('id', 'mouse');
	this.img.attr('src','mouse.jpg');
	this.img.css({
		height: MOUSE_SIZE.height+"px", 
		width: MOUSE_SIZE.width+"px",
		position: "absolute",
		top: this.pos.top+"px",
    	left: this.pos.left+"px"
    });
    $('body').append(this.img);
};

Mouse.prototype.goalCollision = function(){
	for (var index in goals){
		if(detectCollision(this.pos, goals[index].pos)){
			points += goals[index].value;
			console.log("Points: "+ points);
			pointsReference.html(points);
			removeGoal(index);
		}
	}
};

function removeGoal(index){
	var selector = '#goal'+goals[index].id;
	$('body').find(selector).remove();
	goals.splice(index,1);
}

function Cat(){
	this.pos = {};
	this.id = -1;
	this.img = $("<img />");
	$.extend(this.pos, ENEMY_SIZE);
	this.img.css({'height': this.pos.height+'px', 'width': this.pos.width+'px'});
};

Cat.prototype.init = function(id){
	this.pos.top = Math.floor(Math.random() * windowSize.height) + 1;
	this.pos.left = Math.floor(Math.random() * windowSize.width) + 1;
	this.id = id;
	this.img.css({'position': 'absolute',
				  'top': this.pos.top+'px', 
				  'left': this.pos.left+'px'});
	this.img.attr('id','enemy'+id);
	$('body').append(this.img);
	console.log("Cat: " + id +". "+ logPosition(this.pos));
};

Cat.prototype.killCollision = function(){
	if(detectCollision(mouse.pos, this.pos)){
		alert(LOSE_MESSAGE);
		newGame();
	}
};

function CatRandom(){
	Cat.call(this);
	this.img.attr("src","cat_random.gif");
}

CatRandom.prototype = Object.create(Cat.prototype);

CatRandom.prototype.move = function(){
	var shift = {top: (Math.floor(Math.random()*ENEMY_STEP)) * (Math.floor(Math.random()*2) == 1 ? 1 : -1), 
				 left: (Math.floor(Math.random()*ENEMY_STEP)) * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
				};
	this.pos = newPos(this.pos,shift);
	$('#enemy'+this.id).css({'top': this.pos.top+'px', 
				  			 'left': this.pos.left+'px'});
	//console.log("Cat: " + this.id +". "+ logPosition(this.pos));
	this.killCollision();
};

function CatHunter(){
	Cat.call(this);
	this.img.attr("src","cat_hunter.png")
}

CatHunter.prototype = Object.create(Cat.prototype);

CatHunter.prototype.move = function(){
	var current_step = Math.floor(Math.random()*ENEMY_STEP);
	if(Math.floor(Math.random()*2) == 1){
		
		if(mouse.pos.top < this.pos.top){
			$.extend(this.pos, newPos(this.pos,{top: -current_step, left: 0}));
		} else {
			$.extend(this.pos, newPos(this.pos,{top: current_step, left: 0}));
		}
	} else {
		if(mouse.pos.left < this.pos.left){
			$.extend(this.pos, newPos(this.pos,{top: 0, left: -current_step}));
		} else {
			$.extend(this.pos, newPos(this.pos,{top: 0, left: current_step}));
		}
	}
	$('#enemy'+this.id).css({'top': this.pos.top+'px', 
				  			 'left': this.pos.left+'px'});
	//console.log("Cat: " + this.id +". "+ logPosition(this.pos));
	this.killCollision();
};

function newPos(oldPos, shift){
	return {top: oldPos.top+shift.top,
			left: oldPos.left+shift.left};
};

function initEnemy(random, hunter){
	for(var i = 0; i < random; i++){
		var cat = new CatRandom();
		cat.init(i);
		enemies.push(cat);
	}
	for(var i = random; i < hunter+random; i++){
		var cat = new CatHunter();
		cat.init(i);
		enemies.push(cat);
	}
};

function moveEnemy(){
	for (var cat of enemies){
		cat.move();
	}
};

function detectCollision(pos1, pos2){
	if(pos1.left < pos2.left + pos2.width &&
    pos1.left + pos1.width > pos2.left &&
    pos1.top < pos2.top + pos2.height &&
    pos1.height + pos1.top > pos2.top){
		return true;
    } else {
    	return false;
    }
};

function newGame(){
	reset();
	startGame();
};

function reset(){
	clearInterval(enemyIntervalId);
	clearInterval(goalIntervalId);
	$('body').empty();
	enemies = [];
	goals = [];
	goal_index = 0;
	mouse = null;
	points = 0;
};

function clock(){
	time++;
	timeReference.html(Math.floor(time/60)+'m'+time%60+'s');
};

function startGame(){
	mouse = new Mouse();
	$.extend(mouse, $('#mouse'));
    console.log("Window size: " + windowSize.height + " " + windowSize.width);
    console.log("Init position: " + mouse.pos.top + " " + mouse.pos.left);
	initEnemy(ENEMY_RANDOM, ENEMY_HUNTER);
	enemyIntervalId = setInterval(moveEnemy, ENEMY_TIME);
	goalIntervalId = setInterval(createGoal, GOAL_TIME);
	timeIntervalId = setInterval(clock, 1000);
};