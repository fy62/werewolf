
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


/* -----------------    COMPONENT     ------------------ */

class Home extends Component {

  constructor(props) {
    super(props)
  }


  render() {
    return(<div></div>)
   }
}


/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({});
const mapDispatch = () => ({});
export default connect(mapState, mapDispatch)(Home);
