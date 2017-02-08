import React, { Component } from 'react';

function ChatMessage(props) {
  let message = props.message;
  let index = props.index;
  let self = props.self;
  return (<li className="message">
      <div className="avatar">
      </div>
      <div className="text-content">
        <div className="player-name">
          {message.user && message.user.toUpperCase()}
        </div>
        <div className="message-content">
          {message.text}
        </div>
      </div>
  </li>);
}

export default ChatMessage
