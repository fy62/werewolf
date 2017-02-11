import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class DialogExampleModal extends React.Component {
  state = {
    open: true,
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title={`${this.props.winner} won!`}
          actions={actions}
          modal={true}
          open={this.state.open}
        >
        <div className='victorymodal' id={`${this.props.winner}won`}></div>
        </Dialog>
      </div>
    );
  }
}
