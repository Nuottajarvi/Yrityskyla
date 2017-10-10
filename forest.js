var updates = [];
var nextUpdate = {amount: 0, action: ()=>{}};

var harvesterDefaultPos = {x: 60, y: 450};

var colliderPositions = [
//walls
	{x: 0, y: 0, w: 950, h: 20},
	{x: 0, y: 0, w: 25, h: 1000},
	{x: 930, y: 0, w: 25, h: 1000},
	{x: 0, y: 530, w: 950, h: 20}
];

var trees = [];
var colliders = [];
var stage;

function init(){
	//CODE MIRROR
	var code = $(".codemirror-textarea")[0];
	editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		theme: "monokai",
	});

	//RUN BUTTON
	$("#run").click(function(){
		drawTrees();
		Harvester.sprite.x = harvesterDefaultPos.x;
		Harvester.sprite.y = harvesterDefaultPos.y;
		Harvester.sprite.rotation = 0;
		updates = [];
		nextUpdate = {amount: 0, action: ()=>{}};
		var value = editor.getValue();
		eval(value);
	});

	//CREATEJS
	stage = new createjs.Stage("codeCanvas");
	var pohja = new createjs.Shape();
	pohja.graphics.beginFill("#005500").drawRect(0,0,1000,1000);
	stage.addChild(pohja);

	var canvas = document.getElementById("codeCanvas");
	var ctx = canvas.getContext('2d');

	drawTrees();

	for(var i = 0; i < colliderPositions.length; i++){
		var c = colliderPositions[i];
		var rect = new createjs.Rectangle(c.x, c.y, c.w, c.h);
		//TEST BY DRAWING COLLIDERS
		/*var rect = new createjs.Shape();
		rect.graphics.beginFill("green").drawRect(c.x, c.y, c.w, c.h);
		rect.alpha = 0.5;
		stage.addChild(rect);*/
		colliders.push(rect);
	}

	Harvester.sprite = new createjs.Bitmap("./metsakone.png");
	Harvester.sprite.regX = 64;
	Harvester.sprite.regY = 64;
	Harvester.sprite.x = harvesterDefaultPos.x;
	Harvester.sprite.y = harvesterDefaultPos.y;
	Harvester.sprite.scaleX = 1;
	Harvester.sprite.scaleY = 1;
	stage.addChild(Harvester.sprite);

	createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ()=>{update(stage)});
}

function checkTreeCollision(){
	for(var i = 0; i < trees.length; i++){
		if(Math.abs(Harvester.sprite.x - trees[i].x) < 60 && Math.abs(Harvester.sprite.y - trees[i].y) < 60){
			stage.removeChild(trees[i]);
		}
	}
}

function drawTrees(){
	for(var i = 0; i < trees.length; i++){
		stage.removeChild(trees[i]);
	}
	trees = [];
	for(var j = 0; j < 10; j++){
		for(var i = 0; i < 18; i++){	
			var tree = new createjs.Bitmap("./tree.png");
			tree.x = i * 48 + 32 + 24 * (j % 2);
			tree.y = j * 48 + 32;
			tree.scaleX = 0.5;
			tree.scaleY = 0.5;
			tree.regX = 16;
			tree.regY = 16;
			trees.push(tree);
			stage.addChild(tree);
		}
	}
}

function update(stage){
	stage.update();
	if(nextUpdate.amount <= 0){
		if(updates.length > 0){
			nextUpdate = updates.shift();
		}else{
			nextUpdate = {amount: 0, action: ()=>{}};
		}
	}
	nextUpdate.amount--;
	nextUpdate.action();

	checkTreeCollision();
}

function checkWallCollision(x, y){
	for(var collider of colliders){
		if(collider.intersects(new createjs.Rectangle(x-12,y-12,30,30))){
			return false;
		}
	}
	return true;
}

function count(num){
	var a = [];
	for(var i = 0; i < num; i++){
		a.push("");
	}
	return a;
}

var cwc = checkWallCollision;

var Harvester = {
	sprite: null,
	forward: (amt)=>{
		updates.push({amount: amt || 50, action: ()=>{
			
			var rotationRad = -(Harvester.sprite.rotation+180) * Math.PI / 180;

			var x = -Math.cos(rotationRad);
			var y = Math.sin(rotationRad);

			if(cwc(Harvester.sprite.x + x, Harvester.sprite.y + y)){
				Harvester.sprite.x+=x;
				Harvester.sprite.y+=y;
			}
		}})
	},
	backward: (amt)=>{
		updates.push({amount: amt || 50, action: ()=>{
			
			var rotationRad = -(Harvester.sprite.rotation+180) * Math.PI / 180;

			var x = -Math.cos(rotationRad);
			var y = Math.sin(rotationRad);

			if(cwc(Harvester.sprite.x - x, Harvester.sprite.y - y)){
				Harvester.sprite.x-=x;
				Harvester.sprite.y-=y;
			}
		}})
	},
	right: (amt) =>{
		updates.push({amount:amt || 90, action: ()=>{
			if (Harvester.sprite.rotation>359) {
				Harvester.sprite.rotation-=360;
			}
			Harvester.sprite.rotation++;
		}})
	},
	left: (amt) =>{
		updates.push({amount:amt || 90, action: ()=>{
			if (Harvester.sprite.rotation<0) {
				Harvester.sprite.rotation+=360;
			}
			Harvester.sprite.rotation--;
		}})
	}
}