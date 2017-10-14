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

function generateEnemy(){
	const commands = [
		"Die",
		"Bugger off",
		"Begone",
		"Pepare to beet your baker",
		"Beat it",
		"Lets get down to clown",
		"Do your second worst",
		"Shit a brick and call it Mick",
		"What are you doing in my swamp"
	];
	const modifiers = [
		"mildly",
		"rather",
		"seriously",
		"extremely",
		"insanely"
	];
	const adjectives = [
		["angry", "fucking"],
		["insecure", "fake"],
		["rebellious", "spineless"],
		["constipated", "diarrhetic"],
		["very drunk", "beautiful"],
		["pretentious", "pedestrian"],
		["disgruntled", "gruntled"],
		["gruntled", "disgruntled"],
		["buerocratic", "rejected"],
		["pickled", "dried"],
		["fat", "skinny"],
		["ironic", "\"oh so clever\""],
		["carnivorous", "tasty"],
		["confused", "unexplained"],
		["chocolate dipped", "sprinkled"],
		["amateur", "sellout"],
		["starled", "sudden"],
		["snobby", "plebian"],
		["flowerphobic", "flowery"]
	];
	const subjectives = [
		["clowns","pug jugglers"],
		["weathermen","shitstorm"],
		["phone salesmen","customers"],
		["hamsters","guineapigs"],
		["sentient toasters","kettles"],
		["motherfuckers","buggertruckers"],
		["gingerbread men","marzipan pigs"],
		["ducks","geese"],
	];
	const adj = pickRandom(adjectives);
	const subj = pickRandom(subjectives);
	
	var zone = getQueryParams().zone;
	if (zone === undefined) zone = 1;
	const mod = modifiers[parseInt(zone) - 1];
	const enemyName = mod + " " + adj[0] + " " + subj[0];
	const l = rand(zone*10 - 5, zone*10);
	const s = rand(zone*10 - 5, zone*10);
	const m = rand(0, zone);
	const c = rand(zone*100 - 50, zone*100);
	const enemyHailing = pickRandom(commands) + ", you " + adj[1] + " " + subj[1] + "!";
	enemy = new foe(enemyName, l, s, m, c, enemyHailing);
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
		output("As you charge up your engines to get away, the " + enemy.n + " take a shot at you.");
		instantRetaliation();
		if (shields <= 0) {
			return;
		}
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

function instantRetaliation() {
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
}

function retaliation(){
	setTimeout(instantRetaliation, 1000);
}
