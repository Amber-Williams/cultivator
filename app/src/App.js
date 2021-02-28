import React, { useState, useEffect } from "react"
import Amplify, { API, Auth } from 'aws-amplify'
import { AmplifySignOut, } from '@aws-amplify/ui-react'
import config from './aws-exports'
import TimeTracker from './components/time-tracker/time-tracker'
import './App.css';

Amplify.configure(config)
const username_is = "ambertest"
const password_is = "ambertest1234"
const email_is = "amber123@gmail.com"
const phonenumber_is = "+441231231234"

async function signUp() {
  try {
      const { user } = await Auth.signUp({
          username: username_is,
          password: password_is,
          attributes: {
              email: email_is,          // optional
              phone_number: phonenumber_is,   // optional - E.164 number convention
              // other custom attributes 
          }
      });
      console.log(user);
  } catch (error) {
      console.log('error signing up:', error);
  }
}

async function confirmSignUp() {
  try {
    // await Auth.confirmSignUp(username, code);
    await Auth.confirmSignUp(username_is, '059245');
  } catch (error) {
      console.log('error confirming sign up', error);
  }
}

async function resendConfirmationCode() {
  try {
      // await Auth.resendSignUp(username);
      await Auth.resendSignUp(username_is);
      console.log('code resent successfully');
  } catch (err) {
      console.log('error resending code: ', err);
  }
}

async function signIn() {
  try {
      const user = await Auth.signIn(username_is, password_is);
  } catch (error) {
      console.log('error signing in', error);
  }
}

async function signOut() {
  try {
      await Auth.signOut();
  } catch (error) {
      console.log('error signing out: ', error);
  }
}

const App = () => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(async () => {
    await signIn()
    setUser(Auth.user)

    Auth.currentSession().then(res=>{
      const accessToken = res.getAccessToken()
      const jwt = accessToken.getJwtToken()
      setToken(jwt)
    })
    // signUp()
    // confirmSignUp()
    // resendConfirmationCode()
    
  }, []);


  return user ? (
    <div className="App">
      <div>Hello, {user.username}</div>
      <TimeTracker Auth={Auth} API={API} username={user.username} token={token}/>
      <AmplifySignOut/>
    </div>
  ) : (
    <div>auth</div>
    // <AmplifyAuthenticator/>
  );
}

export default App;
