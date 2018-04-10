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
	this.img.attr("src",IMG_FOLDER+"cat_random.gif");
}

CatRandom.prototype = Object.create(Cat.prototype);

CatRandom.prototype.move = function(){
	var shift = {top: (Math.floor(Math.random()*ENEMY_STEP)) * (Math.floor(Math.random()*2) == 1 ? 1 : -1), 
				 left: (Math.floor(Math.random()*ENEMY_STEP)) * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
				};
	this.pos = $.extend(this.pos, newPos(this.pos,shift));
	$('#enemy'+this.id).css({'top': this.pos.top+'px', 
				  			 'left': this.pos.left+'px'});
	//console.log("Cat: " + this.id +". "+ logPosition(this.pos));
	this.killCollision();
};

function CatHunter(){
	Cat.call(this);
	this.img.attr("src",IMG_FOLDER+"cat_hunter.png")
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