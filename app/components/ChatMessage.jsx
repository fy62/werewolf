import React from 'react';

function ChatMessage(props) {
  let message = props.message;
  let players = props.players;
  let color = props.message.color;

  if (message.user !== 'moderator' && !players[message.user]) return <div/>;

  else return (

    <li
      className="message"
      style={(message.user === 'moderator' || !players[message.user].alive) ? {background: color} : {}}
    >
      <div className="avatar">

        {message.user !== 'moderator' ?
          <img
            src={`/images/avatar${players[message.user].avatar}.jpg`}
            /*style={ { border: `3px solid ${players[message.user].color}` } }*/
          /> : <img src={`/images/avatar000.jpg`}/>
        }
      </div>
      <div className="text-content">
        <div
          className="player-name"
          style={ message.user !== 'moderator' ? { color: `${players[message.user].color}` } : {} }
        >
          {message.user.toUpperCase()}
        </div>
        <div className="message-content">
          {message.text.split('\n').map((line, i) => {
            return (
              <div key={i}>{line}</div>
            )
          })}
        </div>
      </div>
    </li>);
}

export default ChatMessage
