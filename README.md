# A JS library for Max MSP communication

This is a small straight-forward library that can be used in order to communicati with an instance of Max MSP.
In order to use it a node.js server is necessary that allows communication using socket.io and UDP.
The communication with Max MSP is based on OSC messages. Therefore the library includes OSC message parsing and creating.

Take a look at [node-MaxComm](https://github.com/fde31/node-MaxComm).
It's a node.js module that can be easily used to setup a node.js server for working with javascript library.

## How to use it


### Example

See [M4L-WebSocket-MultiClient-Drawsound](https://github.com/fde31/M4L-WebSocket-MultiClient-DrawSounds) for an example
that uses this library in order to create a webtool used that communicates with Max For Live through a node.js server.
It's a tool that allows multiple users to control an instance of Ableton Live with their browser.

