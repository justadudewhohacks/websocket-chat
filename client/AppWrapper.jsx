import React from 'react';
import styled from 'styled-components'
import FullScreen from './FullScreen'
import Overlay from './Overlay'

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 1;
`

const BackgroundImage = styled.div`
  background: url(${props => props.src}) no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
`

export default ({ children }) => (
  <FullScreen>
    <ContentWrapper>
      { children }
    </ContentWrapper>
    <FullScreen>
      <BackgroundImage src="background.jpg" />
      <Overlay
        opacity={0.4}
        background="#212121"
      />
    </FullScreen>
  </FullScreen>
)
