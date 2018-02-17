import React from 'react';
import styled from 'styled-components'
import Paper from 'material-ui/Paper';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';


const Wrapper = styled.div`
  cursor: pointer;
`

const getCardTitleStyle = () => ({
  display: 'flex',
  alignItems: 'center'
})

export default ({ chatroom, onEnter }) => (
  <Paper
    style={{ maxWidth: 600, marginBottom: 40 }}
    zDepth={5}
  >
    <Wrapper onClick={onEnter}>
      <Card>
        <CardMedia
          overlay={
            <CardTitle
              title={chatroom.name}
              style={getCardTitleStyle()}
            />
          }
        >
          <img height="100%" src={chatroom.image} alt="" />
        </CardMedia>
      </Card>
    </Wrapper>
  </Paper>
)
