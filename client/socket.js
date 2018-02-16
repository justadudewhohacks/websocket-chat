const io = require('socket.io-client')

export default function(args) {
  const socket = io.connect('http://localhost:3000')

  let connected = function() {}
  let userJoined = function() {}
  let userLeft = function() {}

  function setConnectedCb(cb) {
    connected = cb
  }

  function setUserJoinedCb(cb) {
    userJoined = cb
  }

  function setUserLeftCb(cb) {
    userLeft = cb
  }

  socket.on('connected', connected)
  socket.on('userJoined', userJoined)
  socket.on('userLeft', userLeft)

  socket.on('error', function(err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomId, cb) {
    socket.emit('join', chatroomId, cb)
  }

  function leave(chatroomId, cb) {
      socket.emit('leave', chatroomId, cb)
  }

  function message(chatroomId, message, cb) {
      socket.emit('message', { chatroomId, message }, cb)
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return { register, join, leave, message, getChatrooms, getAvailableUsers, setConnectedCb, setUserJoinedCb, setUserLeftCb }
}

