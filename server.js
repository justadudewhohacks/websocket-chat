const server = require('http').createServer()
const io = require('socket.io')(server)

server.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})

const clients = new Map()
const users = require('./config/users')

function createChatroom({ name, image }) {
  const members = new Set()
  let chatHistory = []

  function broadcast(code, msg) {
    Array.from(members)
      .map(clientId => clients.get(clientId))
      .filter(c => !!c)
      .forEach(
        m => m.client.emit(code, msg)
      )
  }

  function addEntry(user, entry) {
    chatHistory = chatHistory.concat({ user, entry })
  }

  function getChatHistory() {
    return chatHistory.slice()
  }

  return {
    name,
    image,
    members,
    broadcast,
    addEntry,
    getChatHistory
  }
}

const chatrooms = new Map(
  require('./config/chatrooms').map(chatroom => [chatroom.name, createChatroom(chatroom)])
)

function getAvailableUsers() {
  const usersTaken = new Set(Array.from(clients.values()).filter(c => c.user).map(c => c.user.name))
  return users
    .filter(u => !usersTaken.has(u.name))
}

function isUserAvailable(userName) {
  return getAvailableUsers().some(u => u.name === userName)
}

function getUser(userName) {
  return users.find(u => u.name === userName)
}

function getUserByClient(client) {
  return (clients.get(client.id) || {}).user
}

function getChatrooms() {
  return Array.from(chatrooms.values())
    .map(c => ({ name: c.name, image: c.image, numMembers: c.members.size }))
}

io.on('connection', function (client) {
  console.log('client connected...', client.id)
  clients.set(client.id, { client })

  client.on('register', function (userName, callback) {
    if (!isUserAvailable(userName))
      return callback('user is not available')

    const user = getUser(userName)
    clients.set(client.id, { client, user })

    return callback(null, user)
  })

  function ensureExists(getter, rejectionMessage) {
    return new Promise(function (resolve, reject) {
      const res = getter()
      return res
        ? resolve(res)
        : reject(rejectionMessage)
    })
  }

  function ensureUserSelected() {
    return ensureExists(
      () => getUserByClient(client),
      'select user first'
    )
  }

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatrooms.get(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    )
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected()
    ])
      .then(([chatroom, user]) => Promise.resolve({ chatroom, user }))
  }

  function handleEvent(chatroomName, createEntry) {
    return ensureValidChatroomAndUserSelected(chatroomName)
      .then(function ({ chatroom, user }) {
        // append event to chat history
        const entry = { user, ...createEntry(chatroom) }
        chatroom.addEntry(entry)

        // notify other clients in chatroom
        chatroom.broadcast('message', { chat: chatroom.name, ...entry })
        return chatroom
      })
  }

  client.on('join', function (chatroomName, callback) {
    const createEntry = chatroom => ({ event: `joined ${chatroom.name}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // add member to chatroom
        chatroom.members.add(client.id)

        // send chat history to client
        callback(null, chatroom.getChatHistory())
      })
      .catch(callback)
  })

  client.on('leave', function (chatroomName, callback) {
    const createEntry = chatroom => ({ event: `left ${chatroom.name}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // remove member from chatroom
        chatroom.members.delete(client.id)

        callback(null)
      })
      .catch(callback)
  })

  client.on('message', function ({ chatroomName, message } = {}, callback) {
    const createEntry = () => ({ message })

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback)
  })

  client.on('chatrooms', function (_, callback) {
    return callback(null, getChatrooms())
  })

  client.on('availableUsers', function (_, callback) {
    return callback(null, getAvailableUsers())
  })

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    // remove user profile
    clients.delete(client.id)
    // remove member from all chatrooms
    chatrooms.forEach(c => c.members.delete(client.id))
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})
