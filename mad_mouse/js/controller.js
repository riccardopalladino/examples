function createGoal(){
	var goal = GOAL_TYPE[0];
	goals.push(new Goal(goal_index++,goal));
};

function removeGoal(index){
	var selector = '#goal'+goals[index].id;
	$('body').find(selector).remove();
	goals.splice(index,1);
};

function moveEnemy(){
	for (var cat of enemies){
		cat.move();
	}
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