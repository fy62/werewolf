import React from 'react';
import {connect} from 'react-redux';
// import AddImage from './AddImage';

const Riddle = props => {
  return (
    <div>

      <div id="riddle">
        {props.currentRiddle}
      </div>
      <div id="addImage">
        {/*<AddImage
          riddle={props.currentRiddle}
          solution={props.solution}
          dispatchAddImage={props.dispatchAddImmage}
          dispatchUpdateGuessed={props.dispatchUpdateGuessed}
        />*/}
      </div>
      <div id="feedback">
        {props.feedback}
      </div>

    </div>
  )
}

export default Riddle;




