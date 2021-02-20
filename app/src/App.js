import React from "react"
import './App.css';
import Amplify, { API, Auth } from 'aws-amplify'
import config from './aws-exports'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import TimeTracker from './components/time-tracker/time-tracker'

Amplify.configure(config)

function App() {
  return (
    <div className="App">
      <TimeTracker Auth={Auth} API={API}/>
      <AmplifySignOut/>
    </div>
  );
}

export default withAuthenticator(App);
