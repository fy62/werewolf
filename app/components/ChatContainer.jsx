import React from 'react';
import { connect } from 'react-redux';
import NightImage from './NightImage';
import ChatBox from './ChatBox';
import PlayersList from './PlayersList';
import VictoryModal from './VictoryModal';

import {
  sendMessageAction,
  sendVoteAction,
  chooseVote,
  sendSaveAction,
  sendScryAction,
  startGame,
  leaderStart
} from '../reducers/game'

export class ChatContainer extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    // if the leader tries to refresh their game, they're asked if they really want to refresh.
    if (this.props.player.leader){
      window.onbeforeunload = () => {
        return 'You may forfeit any current games if you leave.';
        // this makes the browser ask you if you really want to leave or reload the page
        //no custom message is possible....
      }
    }
  }

  render() {
    return (
      <div className={this.props.game.day ? 'day container' : 'night container'}>
        <div className="chatHalf">
          {
            (this.props.game.day || !this.props.player.alive || this.props.player.role !== 'villager')
            ? <ChatBox
              player={this.props.player}
              messages={this.props.game.messages}
              players={this.props.game.users}
              day={this.props.game.day}
              gameloop={this.props.game.gameInProgress}

              sendMessage={this.props.sendMessage}
              sendVote={this.props.sendVote}
              sendSave={this.props.sendSave}
              sendScry={this.props.sendScry}
              startGame={this.props.startGame}
              leaderStart={this.props.leaderStart}
              />
            : <NightImage/>
          }
          {this.props.game.winner ? <VictoryModal winner={this.props.game.winner} /> : null}
        </div>
        <div className="players-container column-4">
          <PlayersList
            player={this.props.player}
            players={this.props.game.users}
            day={this.props.game.day}
            gameloop={this.props.game.gameInProgress}

            voteTarget={this.props.game.voteTarget}
            chooseVote={this.props.chooseVote}
            sendVote={this.props.sendVote}
            sendSave={this.props.sendSave}
            sendScry={this.props.sendScry}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    game: state.game,
    player: state.game.player,
  };
};

const mapDispatchToProps = dispatch => {
  return ({

    sendMessage (user, message, role) {
      return dispatch(sendMessageAction(user, message, role));
    },
    sendVote (user, target) {
      return dispatch(sendVoteAction(user, target));
    },
    chooseVote (targetObject) {
      return dispatch(chooseVote(targetObject));
    },
    sendScry (seerName, targetName) {
      return dispatch(sendScryAction(seerName, targetName));
    },
    sendSave (priestName, targetName) {
      return dispatch(sendSaveAction(priestName, targetName));
    },
    startGame () {
      return dispatch(startGame());
    },
    leaderStart () {
      return dispatch(leaderStart());
    },

  });
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);

