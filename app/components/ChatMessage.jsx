import React from 'react';

function ChatMessage(props) {
  let message = props.message;
  let players = props.players;

  return (

    <li
      className="message"
      style={ message.user !== 'moderator' ? { background: `${players[message.user].color}` } : { background: 'rgba(192,192,192,.5)'} }
    >
      <div className="avatar">
       {console.log(props)}
        {message.user !== 'moderator' ?
          <img
            src={`/images/avatar${players[message.user].avatar}.jpg`}
            /*style={ { border: `3px solid ${players[message.user].color}` } }*/
          /> : <div>special mod styling</div>
        }
      </div>
      <div className="text-content">
        <div className="player-name">
          {message.user.toUpperCase()}
        </div>
        <div className="message-content">
          {message.text}
        </div>
      </div>
    </li>);
}

export default ChatMessage
