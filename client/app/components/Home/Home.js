import React, { Component } from 'react';
import WrappedLoginForm from "../Form/loginForm"
import {getFromSCtorage, setInStorage} from '../../utils/storage'
import 'whatwg-fetch';

class Home extends Component {
  state = {
      isLoading: false,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
  };
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
      signInError
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
