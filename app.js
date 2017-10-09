var updates = [];
var nextUpdate = {amount: 0, action: ()=>{}};

var janitorDefaultPos = {x: 50, y: 450};

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
					
var smudges = [];
var janitorsprite;
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
		Janitor.sprite.x = janitorDefaultPos.x;
		Janitor.sprite.y = janitorDefaultPos.y;
		updates = [];
		nextUpdate = {amount: 0, action: ()=>{}};
		var value = editor.getValue();
		eval(value);
	});


	//CREATEJS
	stage = new createjs.Stage("codeCanvas");
	var pohja = new createjs.Bitmap("./pohjapiirros.png");
	stage.addChild(pohja);

	var canvas = document.getElementById("codeCanvas");
	var ctx = canvas.getContext('2d');
	
	var pixel = ctx.getImageData(50,50,1,1);
	console.log(pixel);
	
	for(var i = 0; i < 16; i++){
		var smudge = new createjs.Bitmap("./smudge.png");
		smudge.x = smudgePositions[i].x;
		smudge.y = smudgePositions[i].y;
		smudge.regX = 16;
		smudge.regY = 16;
		smudge.rotation = Math.random() * 360;
		smudges.push(smudge);
		stage.addChild(smudge);
	}

	janitorsprite = new createjs.Bitmap("./janitor.png");
	janitorsprite.x = janitorDefaultPos.x;
	janitorsprite.y = janitorDefaultPos.y;
	janitorsprite.regX = 16;
	janitorsprite.regY = 16;
	Janitor.sprite = janitorsprite;
	stage.addChild(janitorsprite);

	createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ()=>{update(stage)});
}

function checkCollision(){
	for(var i = 0; i < smudges.length; i++){
		if(Math.abs(janitorsprite.x - smudges[i].x) < 30 && Math.abs(janitorsprite.y - smudges[i].y) < 30){
			stage.removeChild(smudges[i]);
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
	
	checkCollision();
}

var Janitor = {
	sprite: null,
	forward: (amt)=>{updates.push({amount: amt || 50, action: ()=>{Janitor.sprite.y--;}})},
	left: (amt)=>{updates.push({amount: amt || 90, action: ()=>{Janitor.sprite.x--;}})},
	right: (amt)=>{updates.push({amount: amt || 90, action: ()=>{Janitor.sprite.x++;}})},
	backwards: (amt)=>{updates.push({amount: amt || 50, action: ()=>{Janitor.sprite.y++;}})}
}