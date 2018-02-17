const io = require('socket.io-client')

export default function () {
  const socket = io.connect('http://localhost:3000')

  function registerHandlers({
    onUserJoined,
    onUserLeft,
    onMessageReceived
  }) {
    socket.on('userJoined', onUserJoined)
    socket.on('userLeft', onUserLeft)
    socket.on('message', onMessageReceived)
  }

  function unregisterHandlers() {
    socket.off('userJoined')
    socket.off('userLeft')
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb) {
    socket.emit('message', { chatroomName, message: msg }, cb)
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAvailableUsers,
    registerHandlers,
    unregisterHandlers
  }
}

