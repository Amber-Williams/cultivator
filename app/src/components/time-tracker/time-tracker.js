import React, { useState, useEffect } from 'react'
import Amplify, { API, Auth, AuthClass } from 'aws-amplify'
import TypePicker from './type-picker'
import DayTable from './day-table'

const TimeTracker = () => {
    const [type, set_type] = useState('work')

    const [username, set_username] = useState(null)

    useEffect(() => {
      Auth.currentAuthenticatedUser().then(user => set_username(user.username));
      API.get('userapi', '/api/username').then(data => console.log(data))
    }, [])
  
  
    const clicker = () => {
      API.post('userapi', '/api', {
        body: {
          username,
        }
      })
      .then(data => console.log(data))
    }

    return (
        <div className="TimeTracker">
            <TypePicker type={type} set_type={set_type}/>
            <DayTable type={type}/>
        </div>
    )
}

export default TimeTracker
