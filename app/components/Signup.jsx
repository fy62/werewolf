import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {signUp} from 'APP/app/reducers/auth';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';



function mapDispatchToProps(dispatch) {
  return {
    signUpSubmit: function(name, email, password) {
      dispatch(signUp(name, email, password));
    }
  }
}

export default connect (null, mapDispatchToProps) (
  class SignUp extends Component{
    constructor(){
      super();
      // local state used to verify passwords match before sending to Store
      this.state = {
        password : "",
        errorText : "",
        disabled : true
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChangePassword = this.handleChangePassword.bind(this);
      this.handleChangeConfirm = this.handleChangeConfirm.bind(this);
    }

    handleSubmit(evt){
      evt.preventDefault();
      this.props.signUpSubmit(evt.target.name.value, evt.target.email.value, evt.target.password.value);
    }

    handleChangePassword(evt){
      this.setState({
        password : evt.target.value
      })
    }


    handleChangeConfirm(evt){
      if(this.state.password !== evt.target.value){
        this.setState({
            errorText : "Passwords must match.",
            disabled: true
        })
      } else if (this.state.password.length < 6){
        this.setState({
          errorText: "Password must be at least 6 characters.",
          disabled: true
        })
      } else{
        this.setState({
            errorText : "",
            disabled : false
        })
      }
    }

    render(){
     return (
        <div>
          <div className="formContain">
            <Paper className="signUpPaper" zDepth={2} >
              <h1 className="formHeader">Sign Up</h1>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <TextField
                    name="name"
                    hintText="Name"
                    floatingLabelText="Name"
                  /><br />
                  <TextField
                    name="email"
                    hintText="Email"
                    floatingLabelText="Email"
                  /><br />
                  <TextField
                    name="password"
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={this.handleChangePassword}
                  /><br />
                  <TextField
                    name="passwordConfirm"
                    hintText="Confirm Password"
                    floatingLabelText="Confirm Password"
                    type="password"
                    errorText={this.state.errorText}
                    onChange={this.handleChangeConfirm}
                  /><br />
                  <RaisedButton type="submit" value="signUp" label="Sign Up" backgroundColor="#FA8072" className="button" disabled={this.state.disabled} labelStyle={{color: 'white'}}/>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      );
    }
})






