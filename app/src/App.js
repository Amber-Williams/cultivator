import React, { useEffect, useState } from "react"
import './App.css';
import Amplify, { API, Auth, AuthClass } from 'aws-amplify'
import config from './aws-exports'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import TimeTracker from './components/time-tracker/time-tracker'

Amplify.configure(config)

function App() {
  return (
    <div className="App">
      {/* <button onClick={clicker}> click here to add to db</button> */}
      <TimeTracker/>
      
      <AmplifySignOut/>
    </div>
  );
}

export default withAuthenticator(App);
