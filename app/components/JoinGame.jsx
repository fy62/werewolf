import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {addUser} from '../reducers/game';

export const JoinGame = props => {

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const userName = evt.target.userName.value;
		console.log("inside joinGame handleSubmit ", userName);
		props.addUser(userName);
	}

	return (
        <div>
          <div className="newGame">
          	<div className="formContain">
		        <h1 className="formHeader">Join A Game</h1>
		        <h2>You have been invited to join a Werewolf game</h2>
		        <h3>Please pick a Player Name. You will then be redirected to your game page to chat with your friends.</h3>
		        <form onSubmit={handleSubmit} >
	            <div>
	              <TextField
	                name="userName"
	                floatingLabelText="Player Name"
	                hintStyle={{color: "#AAA"}}
	                underlineFocusStyle={{borderColor: "#FFFFFF"}}
	                inputStyle={{color: "#FFF", fontWeight: 'normal' }}
	                floatingLabelStyle={{color: '#FFF'}}
  	              />
	              <RaisedButton type="submit" value="buildGame" label="Start New Game" backgroundColor="#6E0300" className="button" labelStyle={{color: 'white'}}/>
	            </div>
	         	</form>
	         </div>
          </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
  return ({
    addUser (userName) {
      return dispatch(addUser(userName));
    },
  });
};


export default connect(null, mapDispatchToProps)(JoinGame);

