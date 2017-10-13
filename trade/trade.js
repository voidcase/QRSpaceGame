var app = require('http').createServer();
var io = require('socket.io')(app);

users = {};

io.on('connection', function(socket){
	console.log('new connection');
	socket.on('register', function(name){
		console.log(name + ' registered');
		users[name] = socket;
		for (var u in users) console.log(u);
	});
	socket.on('trade',function(data){
		console.log('data: ' + JSON.stringify(data,null,2));
		if(users.hasOwnProperty(data.target)){
			users[data.target].emit('transfer',data);
			socket.emit('transfer-confirmed',data);
		} else {
			socket.emit('transfer-failed');
		}
	});
});

app.listen(3000);
