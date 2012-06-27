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
After importing you have to create a new instance of MaxCommunicator in order to access the functionality provided by this library:

```html
var maxCommunicator = new MaxCommunication("http://localhost:8080",50000);
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
