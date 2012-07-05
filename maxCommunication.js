var MaxCommunication = (function(){
    var instantiated;

    function init(options){

    	var socket = Websocket.getInstance({'host' : options.socketHost});
		var udpPort = options.udpPort;

		var byteConverter = ByteConverter.getInstance();
		var oscLib = LibOSC.getInstance();

		var controls = {
				'default' : function(msg){console.log(msg);}
		};

		// add Max message listener and handling to socket
		socket.receiveMsg("max",function(data){
			var oscMsg = oscLib.parseOSCMsg(data);
			var functionId = oscMsg.address;

			if(controls[functionId] != undefined){
				controls[functionId](oscMsg.typeFlags,oscMsg.values);
			} else{
				controls["default"](oscMsg);
			}
		});

		// private function to send a message to Max
		function sendMessageToMax(address,typeArray,valueArray){
			socket.sendMsg("max",{"port" : udpPort, "mssg" : oscLib.createOSCMsg(address,typeArray,valueArray)});
		}

		return {
			// SERVER ONLY COMMUNICATION
			sendMsgToServer : function(msgType,data){
				socket.sendMsg(msgType,data);
			},
			receiveMsgFromServer : function(msgType,operation){
				socket.receiveMsg(msgType,operation);
			},
			// RECEIVING MSGS FROM MAX
			setDefaultBehaviour : function(fct){
				controls["default"] = fct;
			},
			addMaxMsgHandler : function(address,operation){
				controls[address] = operation;
			},
			// SENDING MSGS TO MAX
			sendMsgToMax : function(address,typeArray,valueArray){
				sendMessageToMax(address,typeArray,valueArray);
			},
			sendStringToMax : function(address,value){
				sendMessageToMax(address,["s"],[value]);
			},
			sendStringsToMax : function(address,valueArray){
				var typeArray = new Array();
				for(var i = 0; i < valueArray.length; i++){
					typeArray.push("s");
				}
				sendMessageToMax(address,typeArray,valueArray);
			},
			sendIntToMax : function(address,value){
				sendMessageToMax(address,["i"],[value])
			},
			sendIntsToMax : function(address,valueArray){
				var typeArray = new Array();
				for(var i = 0; i < valueArray.length; i++){
					typeArray.push("i");
				}
				sendMessageToMax(address,typeArray,valueArray);
			},
			sendFloatToMax : function(address,value){
				sendMessageToMax(address,["f"],[value]);
			},
			sendFloatsToMax : function(address,valueArray){
				var typeArray = new Array();
				for(var i = 0; i < valueArray.length; i++){
					typeArray.push("f");
				}
				sendMessageToMax(address,typeArray,valueArray);
			}
		}; // END OF PUBLIC SPACE
    }

    // Singleton behaviour
    return {
    	getInstance : function(options){
			if (!instantiated){
				instantiated = init(options);
			}
			return instantiated; 
		}
    };

})();
