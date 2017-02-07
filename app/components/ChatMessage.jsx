import React from 'react';

function ChatMessage(props) {
  let message = props.message;
  let index = props.index;
  let player = props.player;
  return (
    <li className="message">
      <div className="avatar">
        <img
          src={`images/avatar${user.avatar}.jpg`}
          style={ { border: `3px solid ${players[player].color}` } } />
      </div>
      <div className="text-content">
        <div className="player-name">
          {console.log(message)}
          {message.user.toUpperCase()}
        </div>
        <div className="message-content">
          {message.text}
        </div>
      </div>
    </li>);
}

export default ChatMessage
