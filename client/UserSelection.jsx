import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Loader from './Loader'

export default class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      availableUsers: null
    }

    this.handleSelection = this.handleSelection.bind(this)
    this.renderUserItems = this.renderUserItems.bind(this)

    this.props.getAvailableUsers((err, availableUsers) => {
      this.setState({ availableUsers })
    })
  }

  handleSelection(selectedUser) {
    this.props.register(selectedUser.name)
  }

  renderUserItems() {
    return this.state.availableUsers.map(user => (
      <ListItem
        onClick={() => this.handleSelection(user)}
        primaryText={user.name}
        secondaryText={user.statusText}
        key={user.name}
        leftAvatar={<Avatar src={user.image} alt="" />}
      />
    ))
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.props.close}
      />
    ]

    return (
      <Dialog
        title="Pick your character."
        actions={actions}
        modal={false}
        open
        onRequestClose={this.props.close}
      >
        {
          !this.state.availableUsers
            ? <Loader />
            : (
              <List>
                { this.renderUserItems() }
              </List>
            )
        }
      </Dialog>
    )
  }
}
