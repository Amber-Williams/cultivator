import React, { useState, useEffect } from "react"
import Amplify, { API, Auth } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import config from './aws-exports'
import TimeTracker from './components/time-tracker/time-tracker'
import SignOutButton from './components/admin/sign-out-button'
import './App.css';

Amplify.configure(config)

const App = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(user_obj => {
        API.get('api', '/login')
        .then(data => {
            if (data.success) {
                setUsername(user_obj.username)
            }
            
        })
        .catch(err => console.log(err))        
    }).catch(err => console.log(err)); //TODO: error state
  }, []);

  return username ? (
    <div className="App">
      <SignOutButton/>
      <div className="text-light">Hello, {username}</div>
      <TimeTracker API={API} />
    </div>
  ) : (
    <div className="spinner-border text-dark" role="status"></div>
  );
}

export default withAuthenticator(App);
