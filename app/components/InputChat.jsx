import React, { Component } from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import Button from './Button';

import {
  sendMessageAction,
  sendVoteAction,
  sendScryAction,
  sendSaveAction
} from '../reducers/game';


// eventually this has to connect to have access to user, etc
class Chat extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let msg = e.target.message.value;

    if (msg[0] === '/'){
      //Commands are vote, save, seer:
      let cmd = msg.substring(1,5).toLowerCase();
      let target = msg.substring(5).trim().toLowerCase();

      switch(cmd) {

        case 'vote':
          this.props.sendVote(this.props.user.name, target);
          break;

        case 'save':
          if (this.props.game.self.role === 'priest' && !this.props.game.day) {
            this.props.sendSave(this.props.game.self, target);
          }
          break;

        case 'scry':
          if (this.props.game.self.role === 'seer' && !this.props.game.day) {
            this.props.sendScry(this.props.game.self, target);
          }
          break;

        default:
          break;
      }

    }

    else { console.log(this.props.user, msg, 'villager'); this.props.sendMessage(this.props.user.name, msg, 'villager');}

    e.target.message.value = '';
  }


  render() {
    const day = this.props.game.day;

    return (
      <div id="chat-input">
        <form onSubmit={this.handleSubmit}>
          <TextField
            style={{flexGrow: 1, marginLeft: '10px'}}
            id="message"
            hintText={(this.props.user.alive) ? "Enter message here" : "You can't chat when you're dead"}
            hintStyle={{color: day ? '#000' : '#AAA' }}
            underlineFocusStyle={{borderColor: day ? '#0D7A58' : '#6E0300 ' }}
            inputStyle={{color: day ? '#000' : '#FFF' , fontWeight: 'normal' }}
            disabled={(!this.props.user.alive)}
          />
          <Button disabled={(!this.props.user.alive)}
                  type="submit"
                  className="enterText">
                  Enter
          </Button>
        </form>
      </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = state => {
  return {
    game: state.game
  }
};

const mapDispatch = dispatch => {
  return {
    sendMessage: (user, msg, role) => {
      dispatch(sendMessageAction(user, msg, role));
    },
    sendVote: (user, target) => {
      dispatch(sendVoteAction(user, target));
    },
    sendScry: (user, target) => {
      dispatch(sendScryAction(user, target));
    },
    sendSave: (user, target) => {
      dispatch(sendSaveAction(user, target));
    }
  }
};

export default connect(mapState, mapDispatch)(Chat);
