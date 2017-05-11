import React from 'react';
import FlatButton from 'material-ui/FlatButton';

// expects players, user, and day from props
// villager, werewolf, seer, doctor, ... cupid, lovers, hunter, mayor

const PlayersList = (props) => {
  const gameloop = props.gameloop;
  const day = props.day;
  const player = props.player;
  const players = props.players;

  const target = props.voteTarget;
  const chooseVote = props.chooseVote;
  const sendVote = props.sendVote;
  const sendScry = props.sendScry;
  const sendSave = props.sendSave;

  const dead = (person) => {
    if (!person.alive) return 'line-through';
    else return null;
  }

  const pickColor = (person, currentPlayer, vote, daytime) => {
    if (person.name === target) { // if this the player you are trying to vote on....
      return { backgroundColor: person.color }
    }

    else if (
      ((person.role === 'werewolf') && person.alive) && (!daytime) &&
      (!currentPlayer.alive || (currentPlayer.role === 'werewolf'))
      ) { // if both the player and the person on the roster are werewolves, or if the player is dead, show werewolf color
        return { backgroundColor: 'rgba(214, 201, 103, .8)' };
    }

    else if (!person.alive) {
      return { backgroundColor: 'rgba(192, 192, 192, .5)' }
    }

    else {
      return {};
    }
  }

  const button = (gameon, daytime, person) => {
    if (gameon && !daytime && person.role === 'seer') return 'scry';
    else if (gameon && !daytime && person.role === 'priest') return 'save';
    else if (gameon) return 'vote';
    else return 'players';
  }

  const sendAction = (person, selected, daytime) => {
    if (!daytime && person.role === 'seer') sendScry(person, selected);
    else if (!daytime && person.role === 'priest') sendSave(person, selected);
// send the vote to the dispatcher so we can send to firebase, but only if the game is in progress
    else sendVote(person.name, selected);

// clear out the selected user
    chooseVote('');
  }

  // const getIcon = (player, user) => {
  //   if (((!user.alive) || (user.role === 'doctor')) && (player.role === 'doctor')) return <Healing/>;
  //   else if (((!user.alive) || (user.role === 'seer')) && (player.role === 'seer')) return <Eye/>;
  //   else return null;
  // }

  return (
    <div className="players-list" >
      {
        Object.keys(players).map((person, index) => {
          return (


            <div
              className={ day ? 'players light' : 'players dark' }
              key={index}
              style={pickColor(players[person], player, target, day)}
            >
              <FlatButton
                style={{ height: '50px', width: 'inherit'}}
                onClick={() => {
                  if (players[person].alive && gameloop) {
                    chooseVote(players[person].name)
                  }
                  if (players[person].name === target) {
                    chooseVote('')
                  }
                }}
              >
                <div className="player-btn">
                  <div className="avatar" >
                    { (players[person].role === 'werewolf' && !day) ?
                      <img
                        src={`/images/wolf.jpg`}
                        style={ { border: `2.5px solid white` } }
                      />
                      :
                      <img
                        src={`/images/avatar${players[person].avatar}.jpg`}
                        style={ { border: `2.5px solid ${players[person].color}` } }
                      />
                    }
                  </div>
                  <div
                    className="player-name"
                    style={ { textDecoration: dead(players[person]) } } >
                    {players[person].name === player.name ? `:${players[person].name}:` : players[person].name }
                  </div>
                </div>
             </FlatButton>
          </div>
          )
        })
      }
      <FlatButton
        label={button(gameloop, day, player)}
        labelStyle={{ fontFamily: 'IM Fell English SC' }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        className="players vote-btn"
        backgroundColor={ target ? '#0D7A58' : 'rgba(192, 192, 192)' }
        hoverColor={ target ? '#5cc4a3' : 'rgba(192, 192, 192)' }
        onClick={ () => {sendAction(player, target, day)} }
        disabled={!target || !gameloop || !player.alive || (player.name === '!!!!!') || (!day && player.role === 'villager')}
      />
    </div>
  )
}

export default PlayersList;
