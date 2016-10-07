var app = require('http').createServer();
var io = require('socket.io')(app);

users = {};

io.on('connection', function(socket){
	console.log('new connection');
	socket.on('register', function(name){
		console.log(name + ' registered');
		if(users.hasOwnProperty(name)){
			console.log('name ' + name + ' taken');
			socket.emit('name-taken');
		} else {
			users[name] = socket;
			for (var u in users) console.log(u);
		}
	});
	socket.on('trade',function(data){
		if(users.hasOwnProperty(data.target)){
			users[data.target].emit('transfer',data);
			socket.emit('transfer-confirmed',data);
		} else {
			socket.emit('transfer-failed');
		}
	});
});

app.listen(3000);
