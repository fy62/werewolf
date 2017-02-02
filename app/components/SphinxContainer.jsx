import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Sphinx from './Sphinx';
import Riddle from './Riddle';
import {addImage,updateGuessed} from '../reducers/riddle';
import ChatBox from './ChatBox';
import PlayersList from './PlayersList';

const SphinxContainer = props => {
  return(
    <div className="home">
      <div className="chat">
        {
          (props.day || props.user.night)
          ? <ChatBox user={props.user} messages={props.messages}/>
          : <Sphinx/>
        }
      </div>
      <div className="playerslist">
        <PlayersList user={props.user} players={props.players} day={props.day}/>
      </div>
    </div>
  )
}

  const fakePlayers = [
    {
      name: "Bob",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    {
      name: "Bobette",
      role: "werewolf",
      alive: true,
      immunity: false,
      night: true
    },
    {
      name: "Rob",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    {
      name: "Roberta",
      role: "villager",
      alive: false,
      immunity: false,
      night: false
    },
    {
      name: "Bobby",
      role: "werewolf",
      alive: false,
      immunity: false,
      night: true
    },
    {
      name: "Robbie",
      role: "doctor",
      alive: false,
      immunity: false,
      night: true
    },
    {
      name: "Robespierre",
      role: "villager",
      alive: true,
      immunity: false,
      night: false
    },
    {
      name: "NotBob",
      role: "seer",
      alive: true,
      immunity: false,
      night: true
    },
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

  const day = true;

  const bobette = {
    name: "Bobette",
    role: "werewolf",
    alive: true,
    immunity: false,
    night: true
  };
  const notbob = {
    name: "NotBob",
    role: "seer",
    alive: true,
    immunity: false,
    night: true
  };
  const rob = {
    name: "Rob",
    role: "villager",
    alive: true,
    immunity: false,
    night: false
  };

  const fakeMessages = [
    ["you", "blah blah"],
    ["cat", "blah blah"],
    ["you", "blah blah"],
    ["cat", "blah blah"],
    ["you", "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"],
    ["cat", "blah blah"],
    ["you", "blah blah"],
    ["cat", "blah blah"],
    ["you", "blah blah"],
    ["cat", "blah blah blah blah blah blah blah blah blah blah blah blah blah blah"],
  ]

const mapStateToProps = state => {
  return {
    players: fakePlayers,
    user: bobette,
    day: day,
    messages: fakeMessages
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

export default connect(mapStateToProps, mapDispatchToProps)(SphinxContainer);

