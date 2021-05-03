import socketio from 'socket.io-client'

const socket = socketio("http://localhost:5000");

var uniqueId

export {
    socket,
    uniqueId,
}