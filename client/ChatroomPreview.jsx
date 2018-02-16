import React from 'react';
import Paper from 'material-ui/Paper';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const getCardTitleStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default ({ chatroom }) => (
  <Paper
    style={{ maxWidth: 600, margin: 20 }}
    zDepth={5}
  >
    <Card>
      <CardMedia
        overlay={
          <CardTitle
            title={chatroom.name}
            style={getCardTitleStyle()}
          >
            <RaisedButton
              label="Join"
            />
          </CardTitle>
        }
      >
        <img height="100%" src={chatroom.image} alt="" />
      </CardMedia>
    </Card>
  </Paper>
)
