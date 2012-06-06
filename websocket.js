var Websocket = function(socketHost){
	this.socketHost = socketHost;
	this.socket = io.connect(socketHost);

	this.socket.on('connected',function(data){
		console.log(data.connected);
	})
};

Websocket.prototype.receiveMsg = function(msgName,action){
	this.socket.on(msgName,action);
};

Websocket.prototype.sendMsg = function(methodType,data){
	this.socket.emit(methodType,data);
};