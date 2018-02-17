import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import FullScreen from './FullScreen';
import Overlay from './Overlay';

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 1;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1000px;
  margin: auto;
  margin-top: 40px;
`

const BackgroundImage = styled.div`
  background: url(${props => props.src}) no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
`

const AvatarWrapper = styled.div`
  cursor: pointer;
  margin: 0 20px;
  a {
    text-decoration: none;
  }
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

export default ({ children, user }) => (
  <FullScreen>
    <ContentWrapper>
      <Content>
        <AvatarWrapper>
          <Link to="/user">
            { renderAvatar(user) }
          </Link>
        </AvatarWrapper>
        { children }
      </Content>
    </ContentWrapper>
    <FullScreen>
      <BackgroundImage src="background.jpg" />
      <Overlay
        opacity={0.8}
        background="#212121"
      />
    </FullScreen>
  </FullScreen>
)
