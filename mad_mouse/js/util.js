function logPosition(position){
	return "Current position: "+ position.top +" "+ position.left;
};

function newPos(oldPos, shift){
	return {top: oldPos.top+shift.top,
			left: oldPos.left+shift.left};
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

function clock(){
	time++;
	timeReference.html(Math.floor(time/60)+'m'+time%60+'s');
};