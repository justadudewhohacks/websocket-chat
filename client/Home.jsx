import React from 'react';
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import ChatroomPreview from './ChatroomPreview'

const Home = styled.div`
position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1000px;
  margin: auto;
  @media (min-width: 1000px) {
    margin-top: 20px;
  }
`

const Margin = styled.div`
  cursor: pointer;
  margin: 20px;
`

function renderAvatar(user) {
  const props = user
    ? { src: user.image }
    : {
      icon:
      <FontIcon
        style={{ fontSize: 96 }}
        className="material-icons"
      >
        {'perm_identity'}
      </FontIcon>
    }

  return <Avatar size={160} {...props} />
}

export default ({ user, chatrooms, onChangeUser }) => (
  <Home>
    <Margin onClick={onChangeUser}>
      { renderAvatar(user) }
    </Margin>
    <div>
      {
        chatrooms.map(chatroom => <ChatroomPreview key={chatroom.name} chatroom={chatroom} />)
      }
    </div>
  </Home>
)
