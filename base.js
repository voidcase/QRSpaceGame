console.log("starting to load base");

var name, shields, laser, missiles, credits;

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
	document.getElementById("creditviewer").innerHTML = "credits:&nbsp;" + credits;
}

function saveCookie(){
	document.cookie = 'name=' + name + "; path=/";
	document.cookie = 'shields=' + shields + "; path=/";
	document.cookie = 'laser=' + laser + "; path=/";
	document.cookie = 'missiles=' + missiles + "; path=/";
	document.cookie = 'credits=' + credits + "; path=/";
}

name = getCookie("name");
shields = +getCookie("shields");
laser = +getCookie("laser");
missiles = +getCookie("missiles");
credits = +getCookie("credits");

if(shields == 0){
	window.location.replace("death.html");
}

updateShip();

console.log("finished loading base");
