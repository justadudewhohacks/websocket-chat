const Chatroom = require('./Chatroom')
const chatroomTemplates = require('../config/chatrooms')

module.exports = function () {
  // mapping of all available chatrooms
  const chatrooms = new Map(
    chatroomTemplates.map(c => [
      c.name,
      Chatroom(c)
    ])
  )

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client))
  }

  function getChatroomByName(chatroomName) {
    return chatrooms.get(chatroomName)
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize())
  }

  return {
    removeClient,
    getChatroomByName,
    serializeChatrooms
  }
}
