import React, { useRef, useState, useEffect } from 'react'
import { times } from './../../utilities/times'
import TypePicker from './type-picker'
import DatePicker from './../date-picker/date-picker'
import DayTable from './day-table'
import moment from 'moment'
import _ from 'lodash';
import DailyNotes from './daily-notes'

const TimeTracker = ({ API, username, token }) => {
    const [type, set_type] = useState('work')
    const [time_entry, set_time_entry] = useState(null)
    const [notes, set_notes] = useState(null)
    const [loading, set_loading] = useState(true)
    const [api_loading, set_api_loading] = useState(false)
    const [date, set_date] = useState(moment().format('YYYY-MM-DD'))
    const [entry_types, set_entry_types] = useState(null)

    const stateRef = useRef();
    stateRef.current = { date, time_entry, notes }; // gets current state outside of api scope

    useEffect(() => {
      // refactor TODO: place into a seprate component
      API.get('userapi', `/user?_id=${username}`)
        .then(user => {
            console.log('user', user)
            set_entry_types(user.entry_types)
      })
    }, [])

    useEffect(() => {
        set_api_loading(true)
        API.get('userapi', `/entry?_id=${username}__${moment(date).utc().format('YYYY-MM-DD')}`, {header: {Authentication: token} })
        .then(data => {
          if (data["_id"]) {
              data.time_entry ? set_time_entry(data.time_entry) : set_time_entry(times)
              data.notes ? set_notes(data.notes) : set_notes('')
          }
          else {
            set_time_entry(times)
            set_notes('')
          }
          set_api_loading(false)
          set_loading(false)
        })
      }, [date])

    useEffect(() => {
        if (loading) return;
        send_entry()
    }, [notes]);

    const update_time_entry = (time, type) => {
        if (loading) return;
        const time_entry_copy = JSON.parse(JSON.stringify(time_entry))
        time_entry_copy[time] = type
        set_time_entry(time_entry_copy)
        send_entry()
    }

    const send_entry = async () => {
      if (!api_loading) {
        set_api_loading(true)

        API.post('userapi', '/entry', {
          body: {
            _id: `${username}__${moment(stateRef.current.date).utc().format('YYYY-MM-DD')}`,
            date: moment(stateRef.current.date).utc().format('YYYY-MM-DD'),
            time_entry: stateRef.current.time_entry,
            notes: stateRef.current.notes,
          }
        })
        .then(data => {
            const sent_time_entry = data?.data?.time_entry
            const sent_date = data?.data?.date
            const sent_notes = data?.data?.notes
            
            if (stateRef.current.date !== sent_date) {
                // BUG TODO:  if user uses keyboard to change dates too fast it will save over other dates
                console.error('dates are out of sync')
                set_api_loading(false)
                return;
            }

            const same_states = _.isEqual(stateRef.current.time_entry, sent_time_entry) && _.isEqual(stateRef.current.notes, sent_notes) // check frontend and backend states are synced
            set_api_loading(false)
            
            if (!same_states) {
                console.log('states out of sync updating')
                setTimeout(send_entry.bind(this), 500)
            }
        }).catch(err => {
          // TODO: error state
          set_api_loading(false)
          console.error("Error sending entry", err)
        })
      }
    }

    if (!loading) {
      return (
        <div className="TimeTracker">
            <DatePicker date={date} set_date={set_date} />
            <TypePicker set_type={set_type} entry_types={entry_types} username={username}/>
            <DayTable type={type} update_time_entry={update_time_entry} time_entry={time_entry} entry_types={entry_types}/>
            <DailyNotes set_notes={set_notes} notes={notes}/>
        </div>
      )
    } else {
      return (
        <div className="spinner-border text-light" role="status"></div>
        )
    }

}

export default TimeTracker
