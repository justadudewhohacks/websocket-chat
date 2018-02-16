import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';

import UserSelection from './UserSelection';
import socket from './socket'

injectTapEventPlugin()

const Navbar = () => (
  <ul>
    <li> <Link to="/"> { 'Home' } </Link> </li>
    <li> <Link to="/1"> { 'Chatroom 1' } </Link> </li>
    <li> <Link to="/2"> { 'Chatroom 2' } </Link> </li>
  </ul>
)

const Home = () => <h1> { 'Home' } </h1>
const Chatroom = props => <h1> { `$Chatroom ${props.id} ${props.name}`} </h1>

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      name: '',
      isRegisterInProcess: false,
      client: socket()
    }

    this.register = this.register.bind(this)
    this.renderChatroomOrRedirect = this.renderChatroomOrRedirect.bind(this)
    this.onRegisterResponse = this.onRegisterResponse.bind(this)
    this.onEnterUserSelection = this.onEnterUserSelection.bind(this)
  }

  onRegisterResponse(name) {
    this.setState({ isRegisterInProcess: false, name })
  }

  onEnterUserSelection(renderUserSelection) {
    if (this.state.name) {
      return <Redirect to="/" />
    }

    return this.state.isRegisterInProcess
      ? <h1> Loading </h1>
      : renderUserSelection()
  }

  register(name) {
    this.setState({ isRegisterInProcess: true })
    this.state.client.register(name, (err) => {
      if (err) return this.onRegisterResponse('')
      return this.onRegisterResponse(name)
    })
  }

  renderChatroomOrRedirect(renderChatroom) {
    return !this.state.name
      ? <Redirect to="/register" />
      : renderChatroom()
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <Navbar />
            <Switch>
              <Route
                exact
                path="/"
                component={Home}
              />
              <Route
                exact
                path="/register"
                render={
                  (props) => {
                    const toHome = () => props.history.push('/')
                    return this.onEnterUserSelection(() => (
                      <UserSelection
                        close={toHome}
                        register={name => this.register(name, toHome)}
                      />
                    ))
                  }
                }
              />
              <Route
                exact
                path="/1"
                render={() => this.renderChatroomOrRedirect(() => <Chatroom id="1" />)}
              />
              <Route
                exact
                path="/2"
                render={() => this.renderChatroomOrRedirect(() => <Chatroom id="2" />)}
              />
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}
