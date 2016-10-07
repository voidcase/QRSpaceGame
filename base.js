console.log("starting to load base");

var socket = io('http://192.168.1.2:3000');
console.log('loaded socket stuff');

var name, shields, laser, missiles, credits, fuel;
//var ship = {name:"", shields:0 ,laser:0 ,missiles:0, credits:0, fuel:0}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

function output(text){
	var child = document.createTextNode(text);
	var br = document.createElement("br");
	document.getElementById("output").appendChild(child);
	document.getElementById("output").appendChild(br);
}

function getCookie(key) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + key + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function updateShip(){
	document.getElementById("nameviewer").innerHTML = "<b>" + name + "</b>";
	document.getElementById("laserviewer").innerHTML = "laser:&nbsp;" + laser;
	document.getElementById("shieldsviewer").innerHTML = "shields:&nbsp;" + shields;
	document.getElementById("missileviewer").innerHTML = "missiles:&nbsp;" + missiles;
	// document.getElementById("fuelviewer").innerHTML = "fuel:&nbsp;" + fuel;
	document.getElementById("creditviewer").innerHTML = "credits:&nbsp;" + credits;
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
		socket.emit("trade",{target:f["recipient"].value, res:f["trade-resource"].value, amount:f["amount"]});
	else output("you dont have enough of that.");
}

socket.on("transfer-confirmed",function(data){
	output("trade confirmed!");
	this[data.res]-=data.amount;
	updateShip();
	saveCookie();
});
socket.on("transfer-failed",function(){output("trade failed!");});
socket.on("transfer",function(data){
	output("transfer recieved!");
	this[data.res]+=data.amount;
	updateShip();
	saveCookie();
});

name = getCookie("name");
shields = +getCookie("shields");
laser = +getCookie("laser");
missiles = +getCookie("missiles");
credits = +getCookie("credits");
// fuel = +getCookie("fuel");


if(shields == 0){
	window.location.replace("death.html");
}

if(fuel == 0){

}

updateShip();

console.log("finished loading base");
