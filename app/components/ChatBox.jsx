import React from 'react';

import {GridList} from 'material-ui/GridList';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import InputChat from './InputChat';
import Paper from 'material-ui/Paper';
//import FontIcon from 'material-ui/FontIcon';

const ChatBox = (props) => {
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
    ["cat", "blah blah blah blah blah blah blah blah blah blah blah blah blah blah  blah blah blah blah blah blah blah blah blah blah blah blah"],
  ]

  return (

    <div id="chat-container">
      <GridList
        style={{
          maxHeight: window.innerHeight*.6,
          overflowY: 'auto'
        }}
        cols={1}
        cellHeight="auto"
        >
        {fakeMessages.map((message, index) => {return (
          <div key={index} id="all-statements" style={{textAlign: (message[0] === 'cat') ? "left" : "right"}}>
            <Paper id="statement-bubble" zDepth={1} style={{display: "inline-block"}} className={`statement-by-${message[0]}`}>
              <div id="player-name">
                {message[0].toUpperCase()}
              </div>
              <div id="statement">
                {message[1]}
              </div>
            </Paper>
          </div>
        )})}
      </GridList>
      <InputChat addMessage={()=> {}}/>
    </div>
  )
}

export default ChatBox;
