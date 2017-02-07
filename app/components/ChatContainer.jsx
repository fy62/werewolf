import React from 'react';
import { connect } from 'react-redux';
import NightImage from './NightImage';
import ChatBox from './ChatBox';
import PlayersList from './PlayersList';

const ChatContainer = props => {

  return(

    <div className={props.game.day ? 'day container' : 'night container'}>
      <div className="chatHalf">
        {
          (props.game.day || props.user.night || !props.user.alive)
          ? <ChatBox user={props.user} messages={props.game.villager} players={props.game.users} day={props.game.day}/>
          : <NightImage/>
        }
      </div>
      <div className="players-container column-4">
        <PlayersList user={props.user} players={props.game.users} day={props.game.day}/>
      </div>
    </div>

  )
}

// fake hard coded data
{
  const day = false;

  const bobette = {  // live werewolf
    name: "Bobette",
    role: "villager",
    alive: true,
    immunity: false,
    night: true
  };
  const notbob = {  // live seer
    name: "NotBob",
    role: "seer",
    alive: true,
    immunity: false,
    night: true
  };
  const rob = {  // live villager
    name: "Rob",
    role: "villager",
    alive: true,
    immunity: false,
    night: false
  };
  const roberta = {  // dead villager
    name: "Roberta",
    role: "villager",
    alive: false,
    immunity: false,
    night: false
  }
  const bobby = {  // dead werewolf
    name: "Bobby",
    role: "werewolf",
    alive: false,
    immunity: false,
    night: true
  }
  const robbie = {  //dead doctor
    name: "Robbie",
    role: "doctor",
    alive: false,
    immunity: false,
    night: true
  }

    const fakePlayers = [
    {
      name: "Bob",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    bobette,
    {
      name: "Rob",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    roberta,
    bobby,
    robbie,
    {
      name: "Robespierre",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    notbob,
    {
      name: "Other",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    {
      name: "People",
      role: "villager",
      alive: false,
      immunity: false,
      night: false
    },
    {
      name: "To",
      role: "werewolf",
      alive: true,
      immunity: false,
      night: true
    },
    {
      name: "Test",
      role: "villager",
      alive: false,
      immunity: false,
      night: false
    },
    {
      name: "Scrolling",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
  ];

  const fakeMessages = [
    ["Rob", "blah blah blah blah", "day"],
    ["NotBob", "blah blah", "day"],
    ["Bobette", "blah blah blah", "day"],
    ["Roberta", "blah blah blah blah blah blah", "day"],
    ["Bobby", "blah blah blah blah blah blah blah blah", "day"],
    ["Robert", "blah blah blah blah blah", "day"],
    ["Bob", "blah blah blah blah blah blah blah", "day"],
    ["Roberta", "blah blah blah blah", "day"],
    ["Robbie", "blah blah blah blah blah blah", "day"],
    ["Robert", "blah blah blah blah blah blah blah blah", "day"],
    ["Rob", "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah", "day"],
    ["To", "blah blah blah blah", "werewolf"],
    ["Bobette", "blah blah blah blah blah blah", "werewolf"],
    ["Bobby", "blah blah blah", "werewolf"],
    ["To", "blah blah blah blah blah ", "werewolf"],
    ["Bobette", "blah blah blah blah blah blah blah blah blah blah blah blah", "werewolf"],
    ["NotBob", "/peek Rob", "seer"],
    ["Robbie", "/save Bob", "doctor"],
  ]
}

const bobette = {  // live werewolf
    name: "Bobette",
    role: "villager",
    alive: true,
    immunity: false,
    night: true
  };

const mapStateToProps = state => {
  return {
    game: state.game,
    user: bobette
  };
};

const mapDispatchToProps = dispatch => {
  return ({
    dispatchAddImage (image) {
      return dispatch(addImage(image));
    },
    dispatchUpdateGuessed (tags) {
      return dispatch(updateGuessed(tags));
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);

//<!---->
