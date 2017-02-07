import React from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

export const Login = ({ login }) => (
  <div className="formContain">
    <Paper className="loginPaper">
      <h1 className="formHeader">Login</h1>
      <form onSubmit={evt => {
        evt.preventDefault()
        login(evt.target.username.value, evt.target.password.value)
      } }>
        <br />
        <TextField
          hintText="Email"
          name="username"
          floatingLabelText="Email"
        />
        <br />
        <TextField
          hintText="Password"
          name="password"
          type="password"
          floatingLabelText="Password"
        />
        <br />
        <Button
          label="Login"
          name="submit"
          type="submit"
          style={style.button}
        />

      </form>
    </Paper>
  </div>
)

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

export default connect (
  state => ({}),
  {login}
) (Login)

const style = {
  button : {
    margin: 20
  },
  title : {
    fontFamily : "Roboto, sans-serif",
    color : "#57D5FF"
  },
  container : {
    textAlign : "center",
    paddingTop : "5%"
  },
  form : {
    width: '50%',
    height: '50%',
    marginLeft: '25%',
    paddingTop : '5px'
  }
};
