import React, { useEffect, useState } from "react"
import './App.css';
import Amplify, { API, Auth, AuthClass } from 'aws-amplify'
import config from './aws-exports'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

Amplify.configure(config)

function App() {
  const [username, set_username] = useState(null)

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(user => set_username(user.username));
    API.get('usersapi', '/api/username').then(data => console.log(data))
  }, [])


  const clicker = () => {
    API.post('usersapi', '/api', {
      body: {
        username,
      }
    })
    .then(data => console.log(data))
  }

  return (
    <div className="App">
      <header className="App-header">
      <button onClick={clicker}> click here to add to db</button>

      <AmplifySignOut/>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
