import React from 'react';

import ChatroomPreview from './ChatroomPreview'

export default ({
  chatrooms,
  onEnterChatroom
}) => (
  <div>
    {
      chatrooms.map(chatroom => (
        <ChatroomPreview
          key={chatroom.name}
          chatroom={chatroom}
          onEnter={() => onEnterChatroom(chatroom.name)}
        />
      ))
    }
  </div>
)
