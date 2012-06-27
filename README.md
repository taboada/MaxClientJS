# A JS library for Max MSP communication

This is a small straight-forward, javascript client library that can be used in order to communicate with an instance of Max MSP.
In order to use it a node.js server is necessary that allows communication using socket.io and UDP.
The communication with Max MSP is based on OSC messages. Therefore the library includes OSC parsing and creating.

Take also a look at [node-MaxComm](https://github.com/fde31/node-MaxComm).
It's a node.js module that can be easily used to setup a node.js server for working with javascript library.

## How to use it

First import the js files in order to make usable on client side.

```html
<script type="text/javascript" src="bigInt.js"></script>
<script type="text/javascript" src="byteConverter.js"></script>
<script type="text/javascript" src="libOSC.js"></script>
<script type="text/javascript" src="websocket.js"></script>
<script type="text/javascript" src="maxCommunication.js"></script>
```

After importing you have to create a new instance of MaxCommunicator in order to access the functionality provided by this library. Creating this instance is done by passing the Socket.io address and the UDP port on which Max is listening to as parameters. Remember that you define the UDP receiving port in Max using the updreceive object.
In the following example the socket.io host is localhost on port 8080 and Max is listening on port 50000

```js
var maxCommunicator = new MaxCommunication("http://localhost:8080",50000);
```

Now you can access the communication functionality of the maxCommunicator object.
There are two main categories:

### Communication with Max (using server as a bridge)

The library allows you to send single and multiple primitive values to Max as OSC messages as well as more complex OSC messages.
Every message send to the socket.io server is named as "max" and has the following structure:

```js
message.port // the UDP port to which the message should be forwarded
message.mssg // the OSC message as a byte array 
```
Send a single value using an OSC address pattern as the first and the message itself as the second parameter.

```js
maxCommunicator.sendStringToMax("address","message");
maxCommunicator.sendIntToMax("address",42);
maxCommunicator.sendFloatToMax("address",4.2);
```

Send multiple values of the same type in a single OSC Message using the OSC address pattern as the first and an array of values as the second parameter.

```js
maxCommunicator.sendStringsToMax("address",["message1","message2","message3"]);
maxCommunicator.sendIntsToMax("address",[42,420,4200]);
maxCommunicator.sendFloatsToMax("address",[4.2,2.4,42.42]);
```

Sending a more complex message is done by defining the types yourself. This is done according to the Opensoundcontrol specification. These library currently only supports 32-bit integer (i), 32-bit float (f) and string (s) values.

To send a message to Max that contains an integer, a float and a string you have to pass the type definitin array for the specific message as the second parameter.

```js
maxCommunicator.sendMsgToMax("address",["i","f","s"],[42,4.2,"message"]);
```

In order to receive messages from Max the socket.io server should any messages that are received from Max via UDP.
If you are using node.js take a look at my module for node.js in order to realize that easily.
If you are using a different server make sure that you send messages from Max with the message name "max" so that they will be handled the right way using this library.

Every received "max" messages is parsed as an OSC message and by default printed to the console. If you want to change the default behaviour of a MaxCommunication instance, you can do this as the following:

```js
maxCommunicator.setDefaultBehaviour(function(oscMsg){
	// in here you have access to the received OSC message as a parameter

	// oscMsg.address gives you the address string
	// oscMsg.typeFlags gives you an array containing the message type definition flags
	// oscMsg.values gives you an array containing the values of the OSC message
	
	console.log(oscMsg);
});
```

Furthermore you can set specific handlers for different address patterns of the incoming OSC messages.
If a handler is specified for the incoming address the default behaviour won't be executed.
Any defined handler gets two parameters when called. The first one is an array of received type flags, while the second parameter contains an array of the received values.

```js
maxCommunicator.addMaxMsgHandler("address1",function(flags,values){
	console.log("Received message for address1");
	console.log("type flags: " + flags);
	console.log("values: " + values);
});
```

### Communication with the Socket.io server only (no message forwarding to Max)

The following functionality can be used in order to communicate with the server only all the messages are not sent to Max and can f.e. be used in order to keep multiple clients synchronized.

Sending a message to the server can be done by passing the name of the message as the first parameter and the data as the second.
It is also possible to send complex JSON data using this.
The name of the message can be used on the server side in order to identify the message and execute a specific functionality.

```js
maxCommunicator.sendMsgToServer("testMessage",12);
maxCommunicator.sendMsgToServer("testMessage",{"user" : 1, "color" : "#FFFFFF"});
```

In order to receive messages from the server and to avoid the OSC parsing that won't be necessary simply add handlers to the instance of MaxCommunication.

```js
maxCommunicator.receiveMsgFromServer("testMessage",function(data){
	users[data.user].color = data.color;
});
```


## Example

See [M4L-WebSocket-MultiClient-Drawsound](https://github.com/fde31/M4L-WebSocket-MultiClient-DrawSounds) for an example
that uses this library in order to create a webtool used that communicates with Max For Live through a node.js server.
It's a tool that allows multiple users to control an instance of Ableton Live with their browser.

## License

(The MIT License)

Copyright (c) 2012 Florian Demmer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
