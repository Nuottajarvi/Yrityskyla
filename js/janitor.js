var updates = [];
var nextUpdate = {amount: 0, action: ()=>{}};

var janitorDefaultPos = {x: 60, y: 480};

var smudgePositions = [ {x: 310, y: 50},
						{x: 400, y: 60},
						{x: 170, y: 110},
						{x: 250, y: 180},
						{x: 350, y: 120},
						{x: 500, y: 140},
						{x: 600, y: 120},
						{x: 800, y: 110},
						{x: 824, y: 240},
						{x: 452, y: 270},
						{x: 240, y: 300},
						{x: 300, y: 330},
						{x: 160, y: 330},
						{x: 180, y: 470},
						{x: 120, y: 220},
						{x: 300, y: 252}
					];

var colliderPositions = [
//walls
	{x: 0, y: 0, w: 1000, h: 20},
	{x: 0, y: 0, w: 25, h: 1000},
	{x: 20, y: 520, w: 1000, h: 30},
	{x: 250, y: 440, w: 1000, h: 300},
	{x: 345, y: 310, w: 1000, h: 300},
	{x: 565, y: 200, w: 210, h: 130},
	{x: 910, y: 0, w: 50, h: 350},
//rooms
	{x: 30, y: 30, w: 65, h: 410},
	{x: 30, y: 30, w: 255, h: 65},
	{x: 155, y: 150, w: 65, h: 160},
	{x: 155, y: 370, w: 130, h: 65},
	{x: 347, y: 187, w: 158, h: 65},
	{x: 347, y: 187, w: 65, h: 128},
	{x: 468, y: 28, w: 376, h: 64},
	{x: 687, y: 133, w: 160, h: 64},
	{x: 562, y: 173, w: 74, h: 32}
];

var smudges = [];
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
		drawSmudges();
		Janitor.sprite.x = janitorDefaultPos.x;
		Janitor.sprite.y = janitorDefaultPos.y;
		Janitor.sprite.rotation = 0;
		updates = [];
		nextUpdate = {amount: 0, action: ()=>{}};
		var value = editor.getValue();
		eval(value);
	});


	//CREATEJS
	stage = new createjs.Stage("codeCanvas");
	var pohja = new createjs.Bitmap("./img/pohjapiirros.png");
	stage.addChild(pohja);

	var canvas = document.getElementById("codeCanvas");
	var ctx = canvas.getContext('2d');

	drawSmudges();

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

	Janitor.sprite = new createjs.Bitmap("./img/janitor.png");
	Janitor.sprite.regX = 32;
	Janitor.sprite.regY = 32;
	Janitor.sprite.x = janitorDefaultPos.x;
	Janitor.sprite.y = janitorDefaultPos.y;
	Janitor.sprite.scaleX = 0.5;
	Janitor.sprite.scaleY = 0.5;
	stage.addChild(Janitor.sprite);

	createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ()=>{update(stage)});
}

function checkSmudgeCollision(){
	for(var i = 0; i < smudges.length; i++){
		if(Math.abs(Janitor.sprite.x - smudges[i].x) < 30 && Math.abs(Janitor.sprite.y - smudges[i].y) < 30){
			stage.removeChild(smudges[i]);
		}
	}
}

function drawSmudges(){
	for(var i = 0; i < smudges.length; i++){
		stage.removeChild(smudges[i]);
	}
	smudges = [];
	for(var i = 0; i < smudgePositions.length; i++){
		var smudge = new createjs.Bitmap("./img/smudge.png");
		smudge.x = smudgePositions[i].x;
		smudge.y = smudgePositions[i].y;
		smudge.regX = 16;
		smudge.regY = 16;
		smudge.rotation = 360 / smudgePositions.length * i;
		smudges.push(smudge);
		stage.addChild(smudge);
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

	checkSmudgeCollision();
}

function checkWallCollision(x, y){
	for(var collider of colliders){
		if(collider.intersects(new createjs.Rectangle(x-12,y-12,30,30))){
			return false;
		}
	}
	return true;
}

var cwc = checkWallCollision;

var Janitor = {
	sprite: null,
	forward: (amt)=>{
		updates.push({amount: amt || 50, action: ()=>{

			var rotationRad = -(Janitor.sprite.rotation+90) * Math.PI / 180;

			var x = -Math.cos(rotationRad);
			var y = Math.sin(rotationRad);

			if(cwc(Janitor.sprite.x + x, Janitor.sprite.y + y)){
				Janitor.sprite.x+=x;
				Janitor.sprite.y+=y;
			}
		}})
	},
	backward: (amt)=>{
		updates.push({amount: amt || 50, action: ()=>{

			var rotationRad = -(Janitor.sprite.rotation+90) * Math.PI / 180;

			var x = -Math.cos(rotationRad);
			var y = Math.sin(rotationRad);

			if(cwc(Janitor.sprite.x - x, Janitor.sprite.y - y)){
				Janitor.sprite.x-=x;
				Janitor.sprite.y-=y;
			}
		}})
	},
	right: (amt) =>{
		updates.push({amount:amt || 90, action: ()=>{
			if (Janitor.sprite.rotation>359) {
				Janitor.sprite.rotation-=360;
			}
			Janitor.sprite.rotation++;
		}})
	},
	left: (amt) =>{
		updates.push({amount:amt || 90, action: ()=>{
			if (Janitor.sprite.rotation<0) {
				Janitor.sprite.rotation+=360;
			}
			Janitor.sprite.rotation--;
		}})
	}
}
