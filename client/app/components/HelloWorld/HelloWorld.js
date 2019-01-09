import React, { Component } from 'react';
import {getFromSCtorage, setInStorage} from '../../utils/storage'
import 'whatwg-fetch';

class HelloWorld extends Component {
  state = {
     isLoading:true,
     token:""
  }

  componentDidMount() {
    const loginToken = getFromSCtorage('login_token');
    if(loginToken){
      fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginToken}`
        }
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          isLoading: false,
          token: loginToken
        });
      });
    }
  }
//1. signIn only returns the token
//2. it is the things that I am doing things
//3. it is the things in the together
  render() {
    const {
      isLoading,
      token
    } = this.state;
    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }
    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick = {this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <p>Sign Up</p>
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
       </div>
      );
    }
    return (
      <div>
        <p>Welcome to the profile page</p>
      </div>
    );
  }

}

export default HelloWorld;
