function Goal (id, goal){
	this.pos = {top: Math.floor(Math.random()*windowSize.height),
		   left: Math.floor(Math.random()*windowSize.width)};
    $.extend(this.pos, GOAL_SIZE);
	this.type = goal.type;
	this.value = goal.value;
	this.img = $('<img />');
	this.img.attr('src',IMG_FOLDER+this.type+'.png');
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