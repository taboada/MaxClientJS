var Websocket = (function(){
	var instantiated;

	function init(options){
		var socket = io.connect(options.host);
		socket.on('connected',function(data){
			console.log(data.connected);
		});

		return {

			receiveMsg : function(msgName,action){
				socket.on(msgName,action); 
			},
			sendMsg : function(methodType,data){
				socket.emit(methodType,data);
			}
		}
	}

	// EMULATE SINGLETON BEHAVIOUR
	return {
		getInstance : function(options){
			if (!instantiated){
				instantiated = init(options);
			}
			return instantiated; 
		}
	}

})();