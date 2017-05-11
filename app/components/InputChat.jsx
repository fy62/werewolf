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

      switch (cmd) {

        case '/vote':
          if (!this.props.player.alive) break;
          if (this.props.day && this.props.gameloop) this.props.sendVote(this.props.player.name, target);
          else if (!this.props.day && this.props.player.role === 'werewolf' && this.props.gameloop) this.props.sendVote(this.props.player.name, target);
          else {
            this.props.sendMessage('moderator', `You are forbidden from the '${cmd}' action at this time`, this.props.player.uid)
            }
          break;

        case '/save':
          if (!this.props.player.alive) break;
          if (this.props.player.role === 'priest' && !this.props.day && this.props.gameloop) {
            this.props.sendSave(this.props.player, target);
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the '${cmd}' action at this time`, this.props.player.uid)
          }
          break;

        case '/scry':
          if (!this.props.player.alive) break;
          if (this.props.player.role === 'seer' && !this.props.day && this.props.gameloop) {
            this.props.sendScry(this.props.player, target);
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the '${cmd}' action at this time`, this.props.player.uid)
          }
          break;

        case '/help':
          if (!this.props.player.alive) break;
          this.props.sendMessage(
            'moderator',
            `Hi, ${this.props.player.name.toUpperCase()}. Your role is ${this.props.player.role ? this.props.player.role.toUpperCase() : 'not assigned yet'}.\n` +
            `In Nightfall, you have the option between text and button commands.\n` +
            `The button at the end of the player roster will change based on the actions you are allowed at any given time\n` +
            `Text commands can be given by typing slash commands:\n` +
            `'/vote [name]' to vote to nominate someone as a target\n` +
            `'/save [name]' lets the priest save 1 person from the werewolves at night, \n` +
            `'/scry [name]' lets the seer check if 1 person is a werewolf at night\n` +
            `'/roles' and '/ready' are only used by the leader to ask me to hand out roles and start the game, respectively.\n`,
            this.props.player.uid
            )
          break;

        case '/roles':
          if (this.props.player.leader && !this.props.gameloop) {
            this.props.startGame();
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the '${cmd}' action at this time`, this.props.player.uid)
          }
          break;

        case '/ready':
          if (this.props.player.leader && !this.props.gameloop) {
            this.props.leaderStart();
          }
          else {
            this.props.sendMessage('moderator', `You are forbidden from the '${cmd}' action at this time`, this.props.player.uid)
          }
          break;

        default:
          break;
      }
    }

    else {

      if (e.target.message.value === '') {
        return;
      }
// dead people may only ever talk to one another
      if (!this.props.player.alive) {
        this.props.sendMessage(this.props.player.name, msg, this.props.gameloop ? 'purgatory' : 'public')
      }

// if it's a morning message that is not a command, this always goes to the public villager channel
      else if (this.props.day || this.props.winner) {
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
        this.props.sendMessage('moderator', 'You may not speak at this time', this.props.player.uid)
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
            floatingLabelText={(this.props.player.alive || (!this.props.player.alive && !this.props.gameloop)) ? "" : "The living cannot hear you"}
            hintText={(this.props.player.name === '!!!!!') ? "You're spectating this game" : ""}
            hintStyle={{fontFamily: 'IM Fell French Canon'}}
            floatingLabelStyle={{color: day ? '#000' : '#AAA', fontFamily: 'IM Fell French Canon' }}
            underlineFocusStyle={{borderColor: day ? '#0D7A58' : '#6E0300 ' }}
            inputStyle={{color: day ? '#000' : '#FFF', fontWeight: 'normal', fontFamily: 'IM Fell French Canon' }}
            disabled={this.props.player.name === '!!!!!'}
          />
           <IconButton
            type="submit"
            className="enterText"
            disabled={this.props.player.name === '!!!!!'}
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
