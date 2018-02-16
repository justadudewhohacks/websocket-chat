import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Loader from './Loader'

export default class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUser: null,
      availableUsers: null
    }

    this.handleSelection = this.handleSelection.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.renderUserItems = this.renderUserItems.bind(this)

    this.props.getAvailableUsers((err, availableUsers) => {
      this.setState({ availableUsers })
    })
  }

  handleSelection(event, index, selectedUser) {
    this.setState({ selectedUser })
  }

  handleOk() {
    this.props.register(this.state.selectedUser)
  }

  renderUserItems() {
    return this.state.availableUsers.map(user => (
      <MenuItem
        value={user.name}
        key={user.name}
        primaryText={user.name}
        leftIcon={<img source={user.image} alt="" />}
      />
    ))
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
        {
          !this.state.availableUsers
            ? <Loader />
            : (
              <SelectField
                value={this.state.selectedUser}
                onChange={this.handleSelection}
                maxHeight={200}
              >
                { this.renderUserItems() }
              </SelectField>
            )
        }
      </Dialog>
    )
  }
}
