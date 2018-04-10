function Mouse(){
	this.pos = {top: Math.floor(Math.random()*windowSize.height),
		   left: Math.floor(Math.random()*windowSize.width)};
	$.extend(this.pos, MOUSE_SIZE);
	this.img = $('<img />');
	this.img.attr('id', 'mouse');
	this.img.attr('src',IMG_FOLDER+'mouse.jpg');
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