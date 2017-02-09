import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import Send from 'material-ui/svg-icons/content/send';
import IconButton from 'material-ui/IconButton';

export default class Chat extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let msg = e.target.message.value;

    if (msg[0] === '/'){
      //Commands are vote, save, seer:
      const words = msg.split(' ');
      let cmd = words[0].toLowerCase();
      let target;
      if (words.length > 1) target = words[1].toLowerCase();
      switch(cmd) {

        case '/vote':
          if (this.props.day) this.props.sendVote(this.props.player.name, target);
          else if (!this.props.day && this.props.player.role === 'werewolf') this.props.sendVote(this.props.player.name, target);
          else {
            this.props.sendMessage('moderator', `You are forbidden from the ${cmd} action at this time`, this.props.player.uid)
            }
          break;

        case '/save':
          if (this.props.player.role === 'priest' && !this.props.day) {
            this.props.sendSave(this.props.player, target);
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the ${cmd} action at this time`, this.props.player.uid)
          }
          break;

        case '/scry':
          if (this.props.player.role === 'seer' && !this.props.day) {
            this.props.sendScry(this.props.player, target);
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the ${cmd} action at this time`, this.props.player.uid)
          }
          break;

        case '/roles':
          if (this.props.player.leader) {
            this.props.startGame();
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the ${cmd} action at this time`, this.props.player.uid)
          }
          break;

        case '/ready':
          if (this.props.player.leader) {
            this.props.leaderStart();
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the ${cmd} action at this time`, this.props.player.uid)
          }
          break;

        default:
          break;
      }

    }

    else {
// dead people may only ever talk to one another
      if (!this.props.player.alive) {
        this.props.sendMessage(this.props.player.name, msg, 'purgatory')
      }

// if it's a morning message that is not a command, this always goes to the public villager channel
      else if (this.props.day) {
        this.props.sendMessage(this.props.player.name, msg, 'public');
      }

// if it's a night message from the special villagers, it always goes to their user id
      else if (this.props.player.role === 'seer' || this.props.player.role === 'priest') {
        this.props.sendMessage(this.props.player.name, msg, this.props.player.uid);
      }

// if it's a night message from the werewolves, it always goes to the werewolf channel
      else if (this.props.player.role === 'werewolf') {
        this.props.sendMessage(this.props.player.name, msg, 'werewolves');
      }

// other messages are ignored (unless i missed some other case)
      else {
        this.props.sendMessage(this.props.player.name, 'You may not speak at this time', this.props.player.uid)
      }

    }
  //always clear out the input box
    e.target.message.value = '';
  }


  render() {
    const day = this.props.day;

    return (
      <div id="chat-input">
        <form onSubmit={this.handleSubmit}>
          <TextField
            style={{flexGrow: 1, marginLeft: '10px'}}
            id="message"
            floatingLabelText={(this.props.player.alive) ? "" : "The living cannot hear you when you're dead"}
            floatingLabelStyle={{color: day ? '#000' : '#AAA', fontFamily: 'IM Fell French Canon' }}
            underlineFocusStyle={{borderColor: day ? '#0D7A58' : '#6E0300 ' }}
            inputStyle={{color: day ? '#000' : '#FFF', fontWeight: 'normal', fontFamily: 'IM Fell French Canon' }}
          />
           <IconButton
            type="submit"
            className="enterText"
          >
            <Send
              color={day ? '#000' : '#FFF'}
              hoverColor={day ? '#0D7A58' : '#6E0300'}
            />
          </IconButton>
        </form>
      </div>
    )
  }
}
