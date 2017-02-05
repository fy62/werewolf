import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import fetchUsers from '../reducers/game';
import RaisedButton from 'material-ui/RaisedButton';


/* -----------------    COMPONENT     ------------------ */

export const Welcome = () => {
	return (
		<div className='splash'>
			<div className='landingTextBox ' >
				<div className='landingText'>
					<h1>Werewolf</h1>
					<h2>What side will you be on when night falls? </h2>
					<h3>Your quiet little 16th century village has suddenly become infested with some very unfriendly werewolves...
					can you and the other villagers find them before they devour everyone?</h3>
					<h3>Play with your friends! Minimum 5 Players.</h3>
				</div>
			</div>
			<div className='landingButton'>
				<RaisedButton label="Start a Game" backgroundColor={'#1E052B'} labelStyle={{color: 'white'}}/>
			</div>
		</div>
	)
}


/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({});
const mapDispatch = () => ({});

// const handleClick = () => {

// }

export default connect(mapState, mapDispatch)(Welcome);




