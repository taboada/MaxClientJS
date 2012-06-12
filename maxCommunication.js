var MaxCommunication = function(socketHost,udpPort){
	this.socket = new Websocket(socketHost);
	this.udpPort = udpPort;
	this.controls = {};
	this.byteConverter = new ByteConverter();
	this.oscLib = new libOSC(this.byteConverter);

	this.instantiateSocket(this.oscLib,this.controls); 			// workaround in order to pass instance variables to socket object
	this.setDefaultBehaviour(function(msg){console.log(msg);}); // if no default function is set just log the entire msg to the console
};

MaxCommunication.prototype.instantiateSocket = function(oscLib,controls){
	this.socket.receiveMsg("max",function(data){
		var oscMsg = oscLib.parseOSCMsg(data);
		var functionId = oscMsg.address;

		if(controls[functionId] != undefined){
			controls[functionId](oscMsg.typeFlags,oscMsg.values);
		} else{
			controls["default"](oscMsg);
		}
	});
};

/** ----- USE FOR SENDING TO SERVER ----- */

MaxCommunication.prototype.sendMsgToServer = function(msgType,data){
	this.socket.sendMsg(msgType,data);
};

/** ----- USE FOR RECEIVING FROM SERVER ----- **/

MaxCommunication.prototype.receiveMsgFromServer = function(msgType,operation){
	this.socket.receiveMsg(msgType,operation);
};

/** ----- USE FOR RECEIVING MESSAGES FROM MAX ----- **/

MaxCommunication.prototype.setDefaultBehaviour = function(fct){
	this.controls["default"] = fct;
};

MaxCommunication.prototype.addMaxMsgHandler = function(address,operation){
	this.controls[address] = operation;
};

/** ----- USE FOR SENDING MESSAGES TO MAX ----- **/

MaxCommunication.prototype.sendMsgToMax = function(address,typeArray,valueArray){
	this.socket.sendMsg("max",{"port" : this.udpPort, "mssg" : this.oscLib.createOSCMsg(address,typeArray,valueArray)});
};

MaxCommunication.prototype.sendStringToMax = function(address,value){
	this.sendMsgToMax(address,["s"],[value]);
};

MaxCommunication.prototype.sendStringsToMax = function(address,valueArray){
	var typeArray = new Array();
	for(var i = 0; i < valueArray.length; i++){
		typeArray.push("s");
	}
	this.sendMsgToMax(address,typeArray,valueArray);
};

MaxCommunication.prototype.sendIntToMax = function(address,value){
	this.sendMsgToMax(address,["i"],[value])
};

MaxCommunication.prototype.sendIntsToMax = function(address,valueArray){
	var typeArray = new Array();
	for(var i = 0; i < valueArray.length; i++){
		typeArray.push("i");
	}
	this.sendMsgToMax(address,typeArray,valueArray);
};

MaxCommunication.prototype.sendFloatToMax = function(address,value){
	this.sendMsgToMax(address,["f"],[value]);
};

MaxCommunication.prototype.sendFloatsToMax = function(address,valueArray){
	var typeArray = new Array();
	for(var i = 0; i < valueArray.length; i++){
		typeArray.push("f");
	}
	this.sendMsgToMax(address,typeArray,valueArray);
};





