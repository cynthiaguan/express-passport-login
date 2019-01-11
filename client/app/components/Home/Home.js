import React, { Component } from 'react';
import WrappedLoginForm from "../Form/loginForm"
import {getFromSCtorage, setInStorage} from '../../utils/storage'
import 'whatwg-fetch';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  onTextboxChangeSignInEmail(event){
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event){
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event){
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event){
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      signUpEmail,
      signUpPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        // setInStorage('the_main_app', {token: json.token});
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    const {signInEmail, signInPassword} = this.state;
    this.setState ({
        isLoading:true
    });
    fetch('api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    }).then(res => res.json())
    .then(res => {
      if(res.success) {
        setInStorage('login_token', res.token);
        this.setState({
          isLoading: false,
          token:res.token
        })
      }
    })
  }

  render() {
    const containerStyle = {
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:"100vh",
      width: "100vw",
      backgroundColor:"#f8f8f8"
    };

    const LoginStyle = {
      padding:"40px", 
      boxShadow: "0 0 100px rgba(0,0,0,.08)", 
      backgroundColor:"rgb(248, 248, 248)"
    }

    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

     if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }
    if (!token) {
      return (
        <div style={containerStyle}>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
          </div> 
          <div style={LoginStyle}>
              <WrappedLoginForm />
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>Signed in</p>
      </div>
    );
  }

}

export default Home;
