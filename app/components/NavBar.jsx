import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/FlatButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';

/* -----------------    COMPONENT     ------------------ */

const Navbar = () => {

  return (
    <div className='navbar'>
      <div >
        <IconButton
          className='navBtnLeft'
          onClick={() => browserHistory.push('/home')}
          >
          <ActionHome
            color={'#FFFFFF'}
            hoverColor={'#6E0300'}
          />
        </IconButton>
        <h3 className='navBtnLeft'>Werewolf</h3>
      </div>
      <div className="navBtnRight">
       <Link className='icons' to={'newgame'}>Start A Game</Link>
       <Link className='icons' to={'rules'} >Rules</Link>
      </div>
    </div>
  )
}


/* -----------------    CONTAINER     ------------------ */

const mapState = state => {
  return {
    user: state.game.player
  }
};

const mapDispatch = dispatch => {
  return {
    login: (user, pw) => {
      dispatch(login(user, pw))
    },
    logout: () => {
      dispatch(logout())
    }
  }
};

export default connect(mapState, mapDispatch)(Navbar);
