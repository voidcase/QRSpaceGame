console.log("starting to load base");

var socket = io('http://192.168.1.2:3000');
console.log('loaded socket stuff');
var me = this;
var name, shields, laser, missiles, credits, fuel;
var items = new Set();
//var ship = {name:"", shields:0 ,laser:0 ,missiles:0, credits:0, fuel:0}

function getQueryParams() {
	var qs = document.location.href;
    qs = qs.split('?')[1].split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

function rand(lower, upper) {
	return Math.floor((Math.random() * (upper-lower)) + lower);
}

function pickRandom(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

function output(text){
	var child = document.createTextNode(text);
	var br = document.createElement("br");
	document.getElementById("output").appendChild(child);
	document.getElementById("output").appendChild(br);
	window.scrollTo(0,document.body.scrollHeight);
}

function getCookie(key) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + key + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function updateShip(){

	$("#nameviewer").html($("<b></b>").text(name));
	$("#laserviewer").text("laser: " + laser);
	$("#shieldsviewer").text("shields: " + shields);
	$("#missileviewer").text("missiles: " + missiles);
	// $("#fuelviewer").text("fuel: " + fuel);
	$("#creditviewer").text("credits: " + credits);
	if (items.size > 0) {
		$("#itemviewer").empty();
		$("#itemviewer").append(
			"items:",
			$("<ul></ul>").append(Array.from(items).map(x => $('<li></li>').text(x)))
		);
	}
}

function saveCookie(){
	document.cookie = 'name=' + name + "; path=/";
	document.cookie = 'shields=' + shields + "; path=/";
	document.cookie = 'laser=' + laser + "; path=/";
	document.cookie = 'missiles=' + missiles + "; path=/";
	document.cookie = 'credits=' + credits + "; path=/";
	// document.cookie = 'fuel=' + fuel + "; path=/";
}

function trade(){
	var f = document.forms["trade-form"];
	console.log("res: " + f["trade-resource"].value);
	console.log("amount: " + f["amount"].value);
	console.log("recipient: " + f["recipient"].value);
	if(this[f["trade-resource"].value]>=f["amount"].value)
		socket.emit("trade",{
			target:f["recipient"].value.toLowerCase(),
			sender:name,
			res:f["trade-resource"].value,
			amount:f["amount"].value
		});
	else output("you dont have enough of that.");
}

socket.on("transfer-confirmed",function(data){
	output("transfer confirmed!");
	me[data.res]-=parseInt(data.amount);
	updateShip();
	saveCookie();
});
socket.on("transfer-failed",function(){output("transfer failed!");});

socket.on("transfer",function(data){
	output("A transfer of " + data.amount + " " + data.res + " was recieved from " + data.sender + ".");
	me[data.res]+=parseInt(data.amount);
	updateShip();
	saveCookie();
});

name = getCookie("name");
shields = +getCookie("shields");
laser = +getCookie("laser");
missiles = +getCookie("missiles");
credits = +getCookie("credits");
// fuel = +getCookie("fuel");


if(shields == 0 && document.location.pathname !== "/index.html"){
	window.location.replace("death.html");
}

if (name != ""){
	socket.emit('register',name);
}
updateShip();

console.log("finished loading base");
