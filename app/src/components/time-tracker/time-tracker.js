import React, { useRef, useState, useEffect } from 'react'
import { times } from './types'
import TypePicker from './type-picker'
import DatePicker from './../date-picker/date-picker'
import DayTable from './day-table'
import moment from 'moment'
import _ from 'lodash';

const TimeTracker = ({ API, Auth, username, token }) => {
    const [type, set_type] = useState('work')
    const [time_entry, set_time_entry] = useState(null)
    const [loading, set_loading] = useState(true)
    const [api_loading, set_api_loading] = useState(false)
    const [date, set_date] = useState(moment().format('YYYY-MM-DD'))

    const stateRef = useRef();
    stateRef.current = { time_entry }; // gets current state outside of api scope

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      API.get('userapi', `/entry?_id=${username}__${moment(date).utc().format('YYYY-MM-DD')}`, {header: {Authentication: token} })
      .then(data => {
        console.log(data)
        if (data["_id"])
          set_time_entry(data.time_entry)
        else 
          set_time_entry(times)
      })
    }, [date])

    useEffect(() => {
      // TODO: refactor into a seprate component
      API.get('userapi', `/user?_id=${username}`)
        .then(user => {
          console.log('user', user)
          if (!user["_id"]) {
            API.post('userapi', `/user`, {
              body: {
                _id: `${username}`,
                registered: moment().utc().format(),
              }
            })
            .then(user => {
                console.log(user)
            })
          }
      })
      setMounted(true)
    }, [])

    useEffect(() => {
      // TODO: refactor loading/mounted states
      if (!loading && time_entry) {
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

    const send_entry = async () => {
      if (!api_loading) {
        set_api_loading(true)

        API.post('userapi', '/entry', {
          body: {
            _id: `${username}__${moment(date).utc().format('YYYY-MM-DD')}`,
            date: moment(date).utc().format('YYYY-MM-DD'),
            time_entry: stateRef.current.time_entry
          }
        })
        .then(data => {
          const sent_time_entry = data?.data?.time_entry
          const same_states = _.isEqual(stateRef.current.time_entry, sent_time_entry) // check frontend and backend states are synced
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
