const server = require('http').createServer()
const io = require('socket.io')(server)

server.listen(3000, function(err) {
  if (err) throw err
  console.log('listening on port 3000')
})

function createChatroom(chatroomId) {
  const name = `Chatroom ${chatroomId}`
  const members = new Set()

  function broadcast(code, msg) {
    Array.from(members)
      .map(clientId => users.get(clientId))
      .filter(c => !!c)
      .forEach(
        m => m.client.emit(code, msg)
      )
  }

  return { name, members, broadcast }
}

const chatrooms = new Map(
  [1, 2].map(id => [id, createChatroom(id)])
)

const users = new Map()

io.on('connection', function(client) {
  console.log('client connected...', client.id)
  users.set(client.id, { client })

  client.on('register', function(name, callback) {
    if (!name)
        return callback('empty name')

    users.set(client.id, { client, name })

    return callback(null)
  })

  client.on('join', function(chatroomId, cb) {
    const user = users.get(client.id)
    if (!user || !user.name) {
      return callback('not registered')
    }

    const chatroom = chatrooms.get(chatroomId)
    if (!chatroom)
      return callback('invalid chatroom id')

    if (chatroom.members.has(client.id))
      return callback(null)

    // notify other clients in chatroom
    chatroom.broadcast('joined', { chat: chatroom.name, user: user.name })

    // add member to chatroom
    chatroom.members.add(client.id)

    return callback(null)
  })

  client.on('leave', function(chatroomId, callback) {
    const chatroom = chatrooms.get(chatroomId)
    if (!chatroom)
      return callback('invalid chatroom id')

    if (!chatroom.members.has(client.id))
      return callback(null)

    // notify other clients in chatroom
    chatroom.broadcast('left', { chat: chatroom.name, user: users.get(client.id).name })

    // remove member from chatroom
    chatroom.members.delete(client.id)

    return callback(null)
  })

  client.on('message', function({ chatroomId, message } = {}, callback) {
    if (!data.chatroomId || ! data.message)
      return callback('expected chatroomId and message')

    const chatroom = chatrooms.get(chatroomId)
    if (!chatroom)
      return callback('invalid chatroom id')

    chatroom.broadcast('message', message)

    return callback(null)
  })

  client.on('disconnect', function() {
    console.log('client disconnect...', client.id)
    // remove user profile
    users.delete(client.id)
    // remove member from all chatrooms
    chatrooms.forEach(c => c.members.delete(client.id))
  })

  client.on('error', function(err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})