var updates = [];
var nextUpdate = {amount: 0, action: ()=>{}};

var janitorDefaultPos = {x: 70, y: 480};

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
		var value = editor.getValue();
		eval(value);
	});


	//CREATEJS
	var stage = new createjs.Stage("codeCanvas");
	var pohja = new createjs.Bitmap("./pohjapiirros.png");
	stage.addChild(pohja);
	console.log(stage);
	console.log(pohja);
	var sotku = new createjs.Bitmap("./dirt2.png");
	stage.addChild(sotku);


	var janitorsprite = new createjs.Bitmap("./janitor.png");
	janitorsprite.regX=32;
	janitorsprite.regY=32;
	janitorsprite.x = janitorDefaultPos.x;
	janitorsprite.y = janitorDefaultPos.y;
	Janitor.sprite = janitorsprite;
	stage.addChild(janitorsprite);

	createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ()=>{update(stage)});
}

function update(stage){
	console.log(nextUpdate);
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
}

var Janitor = {
	sprite: null,
	forward: (amt)=>{updates.push({amount: amt || 50, action: ()=>{Janitor.sprite.y--;}})},
	left: (amt)=>{updates.push({amount: amt || 90, action: ()=>{Janitor.sprite.x--;}})},
	right: (amt)=>{updates.push({amount: amt || 90, action: ()=>{Janitor.sprite.x++;}})},
	backwards: (amt)=>{updates.push({amount: amt || 50, action: ()=>{Janitor.sprite.y++;}})},
	turnRight: (amt) =>{updates.push({amount:amt || 90, action: ()=>{Janitor.sprite.rotation++;}})},
	turnLeft: (amt) =>{updates.push({amount:amt || 90, action: ()=>{Janitor.sprite.rotation--;}})}
}
