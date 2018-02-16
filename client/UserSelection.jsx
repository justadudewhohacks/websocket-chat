import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }

  handleInput(e) {
    this.setState({ input: e.target.value })
  }


  handleOk() {
    this.props.register(this.state.input)
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.props.close}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={this.handleOk}
      />
    ]

    return (
      <Dialog
        title="What's your name?"
        actions={actions}
        modal={false}
        open
        onRequestClose={this.props.close}
      >
        <TextField
          hintText="Enter your name."
          floatingLabelText="Enter your name."
          value={this.state.input}
          onChange={this.handleInput}
        />
      </Dialog>
    )
  }
}
