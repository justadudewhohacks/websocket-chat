import React from 'react';
import styled from 'styled-components'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

const ChatPanel = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #fafafa;
  height: 100%;
  width: 420px;
  box-sizing: border-box;
`

const NoDots = styled.div`
  hr {
    visibility: hidden;
  }
`

const OutputText = styled.div`
  white-space: normal !important;
  word-break: break-all !important;
  overflow: initial !important;
  width: 100%;
  height: auto !important;
`

const InputPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  align-self: center;
`

export default class Chatroom extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      chatHistory: [],
      input: ''
    }

    this.onInput = this.onInput.bind(this)
    this.onSendMessage = this.onSendMessage.bind(this)
    this.onUserJoined = this.onUserJoined.bind(this)
    this.onUserLeft = this.onUserLeft.bind(this)
    this.onMessageReceived = this.onMessageReceived.bind(this)
  }

  componentDidMount() {
    const {
      onUserJoined,
      onUserLeft,
      onMessageReceived
    } = this

    this.props.registerHandlers({
      onUserJoined,
      onUserLeft,
      onMessageReceived
    })
  }

  componentWillUnmount() {
    this.props.unregisterHandlers()
  }

  onInput(e) {
    this.setState({
      input: e.target.value
    })
  }

  onSendMessage() {
    this.props.onSendMessage(this.state.input, (err) => {
      if (err)
        return console.error(err)

      return this.setState({ input: '' })
    })
  }

  onUserJoined({ user }) {
    console.log('user joined:', user)
  }

  onUserLeft({ user }) {
    console.log('user left:', user)
  }

  onMessageReceived({ user, message }) {
    console.log('onMessageReceived:', user, message)
    this.setState({ chatHistory: this.state.chatHistory.concat({ user, message }) })
  }

  componentDidUpdate() {
    console.log(this.panel)
    //foo.scrollTo(0, foo.scrollHeight)
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <RaisedButton
          label="Leave"
          onClick={this.props.onLeave}
        />
        <ChatPanel ref={(panel) => { this.panel = panel; }}>
          <List style={{height: '100%', overflow: 'auto'}}>
            {
              this.state.chatHistory.map(
                ({ user, message }) => [
                  <NoDots>
                    <ListItem
                      leftAvatar={<Avatar src={user.image} />}
                      primaryText={user.name}
                      secondaryText={
                        <OutputText>
                          {message}
                        </OutputText>

                      }
                    />
                  </NoDots>,
                  <Divider inset />
                ]
              )
            }
          </List>
          <InputPanel>
            <TextField
              hintText="Enter a message."
              floatingLabelText="Enter a message."
              multiLine
              rows={4}
              rowsMax={4}
              onChange={this.onInput}
              value={this.state.input}
            />
            <FloatingActionButton
              onClick={this.onSendMessage}
              style={{ marginLeft: 20 }}
            >
              <FontIcon
                style={{ fontSize: 32 }}
                className="material-icons"
              >
                {'chat_bubble_outline'}
              </FontIcon>
            </FloatingActionButton>
          </InputPanel>
        </ChatPanel>
      </div>
    )
  }
}
