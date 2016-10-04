var app = require('http').createServer();
var io = require('socket.io')(app);

users = {};

io.on('connection', function(socket){
	socket.on('enter', function(name)){
		if(users.contains(name)){
			socket.emit('name-taken');
			return;
		}
		users[name] = socket;
		on('trade',function(data){
			if(users.contains(data.target)){
				users[data.target].emit('transfer',data);
			} else {
				socket.emit('transfer-failed');
			}
		});
	}
});
