import React, { useState, useEffect } from 'react'
import { times } from './types'
import TypePicker from './type-picker'
import DayTable from './day-table'
import moment from 'moment'

const TimeTracker = ({ API, Auth }) => {
    const [type, set_type] = useState('work')
    const [username, set_username] = useState(null)
    const [time_entry, set_time_entry] = useState(null)
    const [loading, set_loading] = useState(true)

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      Auth.currentAuthenticatedUser().then(user => set_username(user.username))
      API.get('userapi', '/api/username').then(data => {
        // TODO: data can be an empty list here sometimes, if so we need to add the user to the database...can we add them on registration auth?
        data[0].time_entry ? set_time_entry(data[0].time_entry) : set_time_entry(times)
      })
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!loading) {
        // TODO: sending entry delay
        send_entry()
      }
      if (loading && time_entry){
        set_loading(false)
      } 
      
    }, [time_entry]);

    const update_time_entry = (time, type) => {
        const time_entry_copy = JSON.parse(JSON.stringify(time_entry))
        time_entry_copy[time] = type
        set_time_entry(time_entry_copy)
    }

    const send_entry = () => {
    console.log({
        username,
        entry_date: moment.utc().format(),
        time_entry
      })
      API.post('userapi', '/api', {
        body: {
          username,
          entry_date: moment.utc().format(),
          time_entry
        }
      })
      .then(data => console.log(data))
    }

    if (!loading && mounted){
      return (
        <div className="TimeTracker">
            <TypePicker type={type} set_type={set_type}/>
            <DayTable type={type} update_time_entry={update_time_entry} time_entry={time_entry}/>
        </div>
      )
    } else {
      return <div>loading</div>
    }

}

export default TimeTracker
