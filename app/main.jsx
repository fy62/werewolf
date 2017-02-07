'use strict'
import React from 'react';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';
import store from './store';
import App from './components/App';
import Welcome from './components/Welcome';
import JoinGame from './components/JoinGame';
import NewGame from './components/NewGame';
import Rules from './components/Rules';
import ChatContainer from './components/ChatContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="/home" />
          <Route path="/home" component={Welcome} />
          <Route path="/newgame" component={NewGame} />
          <Route path='/joingame' component={JoinGame} />
          <Route path="/rules" component={Rules} />
          <Route path="/chat" component={ChatContainer} />
          <Route path="/chat/:id" component={ChatContainer} />
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
