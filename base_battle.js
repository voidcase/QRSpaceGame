var maxShields = shields;
var enemy;

var laserAudio = new Audio("res/laser.mp3");
var missileAudio = new Audio("res/missile.mp3");
var shieldsAudio = new Audio("res/powerup.mp3");
var scannerAudio = new Audio("res/scanner.wav");

function foe(n,l,s,m,c,h){
	this.n = n; //name
	this.s = s; //shields
	this.l = l; //lasers
	this.m = m; //missiles
	this.c = c; //credits
	this.h = h; //greeting
}

function generateEnemy(enemies){
	enemy = enemies[Math.floor(Math.random()*(enemies.length))];
}

function checkVictory(){
	if(enemy.s<=0){
		output("The " + enemy.n + " got blown to pieces. You stand victorious in battle.");
		output("Looting the debris of the enemy, " + enemy.c + " credits were recovered.");
		shields = maxShields;
		output("shields regenerated to capacity.");
		output("COMBAT MODE : DISENGAGED");
		output("You can now safely hyperdrive to the next location.");
		credits += +enemy.c;
		updateShip();

		document.getElementById("input").style.visibility = "hidden";

		document.cookie = 'missiles=' + missiles + "; path=/";
		document.cookie = 'credits=' + credits + "; path=/";
	}
	else{
		retaliation();
	}
}

function fireLaser(){
	if(shields<=0) return;
	var damage = Math.floor(laser*Math.random());
	enemy.s -= damage;
	laserAudio.play();
	if(damage == 0){
		output("your laser missed!");
	}
	else{
		output("you dealt " + damage + " laser damage to the " + enemy.n);
	}
	checkVictory();
}

function fireMissile(){
	if(missiles >= 1){
		missileAudio.play();
		missiles -= 1;
		enemy.s -= 5;
		output("Your missile did 5 damage to the " + enemy.n);
		if(Math.random() < 0.5) {
			enemy.l -= 1;
			output("it also took out one of their laser cannons!");
		}
	}
	else{
		output("You are out of missiles.");
	}
	checkVictory();
}

function raiseShields(){
	var diff = Math.floor(Math.random()*(maxShields-shields));
	shields += diff;
	output("shields regenerated " + diff + " points.");
	shieldsAudio.play();
	retaliation();
}
function retreat(){
	if(confirm("Captain, starting the hyper drive now will make the damage to your shields pernament. Are you sure you want to retreat?")){
		document.cookie = "shields=" + shields + ";path=/";
		maxShields=shields;
		updateShip();
		output("You retreat from the battle.");
		document.getElementById("input").style.visibility = "hidden";
	}
}
function scan(){
	output("---BEGIN SCAN REPORT---");
	output("TARGET   : " + enemy.n);
	output("LASERS   : " + enemy.l);
	output("SHIELDS  : " + enemy.s);
	output("MISSILES : " + enemy.m);
	output("----END SCAN REPORT----")
	scannerAudio.play();
	//retaliation(); retaliation means nobody uses scan
}
function retaliation(){
	setTimeout(function(){
	var damage = Math.floor(enemy.l*Math.random());
	shields -= damage;
	if(damage == 0){
		output("enemy laser missed!");
	}
	else{
		output(enemy.n + " dealt " + damage + " damage to your ship.");
	}

	updateShip();
	if(shields<=0){
		output("Your ship has been wrecked. Game over.");
		document.getElementById("input").style.visibility = "hidden";
		document.cookie = "shields=0;path=/";
		document.cookie = "credits=0;path=/";
	}
	},1000);
}

socket.on('transfer',function(data){
	if (data.res == "shields"){
		maxShields += parseInt(data.amount);
	}
});
socket.on('transfer-confirmed',function(data){
	if (data.res == "shields"){
		maxShields -= parseInt(data.amount);
	}
});
