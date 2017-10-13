var me = this;
var name, shields, laser, missiles, credits, fuel;
var items = new Set();
//var ship = {name:"", shields:0 ,laser:0, missiles:0, credits:0, fuel:0}

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
	// if (items.size > 0) {
	// 	$("#itemviewer").empty();
	// 	$("#itemviewer").append(
	// 		"items:",
	// 		Array.from(items).join(", ")
	// 	);
	// }
}

function saveCookie(){
	document.cookie = 'name=' + name + "; path=/";
	document.cookie = 'shields=' + shields + "; path=/";
	document.cookie = 'laser=' + laser + "; path=/";
	document.cookie = 'missiles=' + missiles + "; path=/";
	document.cookie = 'credits=' + credits + "; path=/";
	// document.cookie = 'items=' + Array.from(items).join('|') + "; path=/";
	// document.cookie = 'fuel=' + fuel + "; path=/";
}

name = getCookie("name");
shields = +getCookie("shields");
laser = +getCookie("laser");
missiles = +getCookie("missiles");
credits = +getCookie("credits");
// itemstring = getCookie("items");
// if (itemstring) {
// 	itemstring.split('|').forEach(x => items.add(x));
// }
// fuel = +getCookie("fuel");


if(shields == 0 && document.location.pathname !== "/index.html"){
	window.location.replace("death.html");
}

updateShip();

console.log("finished loading base");
