import React, { useState, useEffect } from "react"
import Amplify, { API, Auth } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import config from './aws-exports'
import TimeTracker from './components/time-tracker/time-tracker'
import SignOutButton from './components/admin/sign-out-button'
import './App.css';

Amplify.configure(config)

const App = () => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(user => setUser(user))
    Auth.currentSession().then(res=>{
      const accessToken = res.getAccessToken()
      const jwt = accessToken.getJwtToken()
      setToken(jwt)
    })
  }, []);


  return user ? (
    <div className="App">
      <SignOutButton/>
      <div className="text-light">Hello, {user.username}</div>
      <TimeTracker API={API} username={user.username} token={token}/>
      
    </div>
  ) : (
    <div>loading</div>
  );
}

export default withAuthenticator(App);
