import React, {Component} from 'react';
import {connect} from 'react-redux';
import AddImage from './AddImage';

const Riddle = props => {
  return (
    <div>

      <div id="riddle">
        {props.currentRiddle}
      </div>

      <AddImage
        riddle={props.currentRiddle}
        solution={props.solution}
        imageUrl={props.imageUrl}
        dispatchAddImageUrl={props.dispatchAddImageUrl}
        dispatchUpdateGuessed={props.dispatchUpdateGuessed}
      />

      <div id="feedback">
        {props.feedback}
      </div>

    </div>
  )
}

export default Riddle;




