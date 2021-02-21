import React, { useRef, useState, useEffect } from 'react'
import { times } from './types'
import TypePicker from './type-picker'
import DatePicker from './../date-picker/date-picker'
import DayTable from './day-table'
import moment from 'moment'
import _ from 'lodash';

const TimeTracker = ({ API, Auth }) => {
    const [type, set_type] = useState('work')
    const [username, set_username] = useState(null)
    const [time_entry, set_time_entry] = useState(null)
    const [loading, set_loading] = useState(true)
    const [api_loading, set_api_loading] = useState(false)
    const [date, set_date] = useState(moment().format('YYYY-MM-DD'))

    const stateRef = useRef();
    stateRef.current = { time_entry }; // gets current state outside of api scope

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      Auth.currentAuthenticatedUser().then(user => set_username(user.username))
      API.get('userapi', '/api/username').then(data => {
        // TODO: data can be an empty list here sometimes, if so we need to add the user to the database...can we add them on registration auth?
        data[0].time_entry ? set_time_entry(data[0].time_entry) : set_time_entry(times)
        console.log(data)
      })
      setMounted(true)
    }, [])

    useEffect(() => {
      // TODO: refactor loading/mounted states

      if (!loading && time_entry) {
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
      if (!api_loading) {
        set_api_loading(true)

        // TODO: fix db data model to work with one user to many entry_dates
        
        API.post('userapi', '/api', {
          body: {
            username,
            entry_date: moment(date).utc().format(),
            time_entry: stateRef.current.time_entry
          }
        })
        .then(data => {
          console.log(data)
          const sent_time_entry = data?.data?.time_entry
          const same_states = _.isEqual(stateRef.current.time_entry, sent_time_entry); // frontend and backend states are synced
          set_api_loading(false)

          if (!same_states) {
            console.log('states out of sync updating')
            send_entry()
          }
        }).catch(err => {
          // TODO: error state
          set_api_loading(false)
          console.log("ERROR SENDING ENTRY", err)
        })
      }
    }

    function on_date_change(e) {
      const date = e.target.value
      set_date(date)
    }

    if (!loading && mounted) {
      return (
        <div className="TimeTracker">
            <DatePicker date={date} on_change={on_date_change}/>
            
            <TypePicker type={type} set_type={set_type}/>
            <DayTable type={type} update_time_entry={update_time_entry} time_entry={time_entry}/>
        </div>
      )
    } else {
      return <div className="text-light m-5">loading</div>
    }

}

export default TimeTracker
