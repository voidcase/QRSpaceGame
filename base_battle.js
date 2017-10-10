var maxShields = shields;
var enemy;

var laserAudio = new Audio("res/laser.mp3");
var missileAudio = new Audio("res/missile.mp3");
var shieldsAudio = new Audio("res/powerup.mp3");
var scannerAudio = new Audio("res/scanner.wav");

enemySets = [
	[ //easy
		//starwars enemies
		new foe("TIE-Fighter",6,10,1,200,"SHRIEEEEEEEEKKK!!!!!!!!!!!!!!"),
		new foe("TIE-Interceptor",10,6,1,200,"You are trespassing in imperial space. Surrender immediately."),
		new foe("TIE-Bomber",12,8,2,300,"Die rebel scum!"),
		new foe("Imperial lambda-class shuttle",12,12,3,400,"On imperial order, shut of your engines and await arrest."),
		new foe("Weequay pirates",8,11,1,300,"Jeqw asdbÿ, uqêvah saégh-sabbve!"),
		//gen 1 enemies
		new foe("lost cosmonauts",7,8,1,100,"SURRENDER TO CCCP YOU CAPITALIST SWINES!"),
		new foe("space pirates",11,8,0,200,"YARR!! All ye credits shall be ours!"),
		new foe("space sharks",7,9,0,0,"duuun-dun...duuuun-dun....dun-dun-dun-dun-dun-dun..."),
		new foe("terrible anti-kessler drone",11,13,1,500,"On orders of the mid-orbital council, All orbiting debris must be terminated. If you are not a piece of debris, please file a declaration of necessity in a sealed envelope to your local space transportation office within the next two seconds. The mid-orbital council thanks you for your time and cooperation."),
		new foe("Imperial scoutship",7,15,2,800,"The empire shall rule the universe. Glory to The Emperor!")
	],
	[
		new foe("Victory Class Star Destroyer",20,15,3,1000,"You will know the power of the dark side"),
		new foe("Imperial Class Star Destroyer",15,20,3,1000,"You are sentenced to immediate execution for crime against the empire."),
		new foe("Dreadnaught Class Heavy Cruiser",15,15,4,600,"The resistance will be crushed!")
	]
]

function foe(n,l,s,m,c,h){
	this.n = n; //name
	this.s = s; //shields
	this.l = l; //lasers
	this.m = m; //missiles
	this.c = c; //credits
	this.h = h; //greeting
}

function generateEnemy(){
	var setid = getQueryParams().set;
	if (setid === undefined) setid = 0;
	const enemies = enemySets[setid];
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
	if (shields === maxShields) {
		output("shields already at maximum");
		return;
	}
	var diff = 2 + Math.floor(Math.random()*(maxShields-shields));
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
