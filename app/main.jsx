'use strict'
import React from 'react';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';
import store from './store';
import App from './components/App';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Rules from './components/Rules';
import SphinxContainer from './components/SphinxContainer';
import {getRiddle} from './reducers/riddle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const onSphinxEnter = () => {
  let today = new Date();
  let todayNum = today.getDay();
  store.dispatch(getRiddle(todayNum));
}

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="/home" />
          <Route path="/home" component={Welcome} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/rules" component={Rules} />
          <Route path="/sphinx" component={SphinxContainer} onEnter={onSphinxEnter}/>
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
