import React, { useState, useEffect } from 'react'
import { types } from './types'
import "./time-tracker.css"

const Interval = ({ index, main, type, update_time_entry, time_entry }) => {
    const [ style, set_style ] = useState({
        backgroundColor: types.none
    })
    const interval_naming = [main, '15', '30', '45']
    const id = `${main}:${index === 0 ? '00': interval_naming[index]}`

    useEffect(() => {
        if (time_entry[id]) {
            set_style({
                backgroundColor: types[time_entry[id]],
                color: types[time_entry[id]] === 'black' ? 'white' : 'black'
            })
            console.log(id, 'marked as', time_entry[id])
        } else {
            set_style({
                backgroundColor: types['none'],
                color: 'black'
            })
        }
    }, [time_entry[id]])

    function handle_click(e){
        type === 'none' ? update_time_entry(e.target.id, null) :  update_time_entry(e.target.id, type)
    }

    return <div id={id}
                onClick={handle_click}
                style={style}
                className={index === 0 ? 'Interval Interval--main' : 'Interval'}>
                    {interval_naming[index]}
            </div>
}

const Hour = ({ index, type, update_time_entry, time_entry }) => (
    <div className="Hour d-flex">
        {[...Array(4)].map((_, i) =>  <Interval key={i} index={i} main={index + 1} type={type} update_time_entry={update_time_entry} time_entry={time_entry}/> )}
    </div>
)

const DayTable = ({ type, update_time_entry, time_entry}) => {
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <Hour key={i} index={i} type={type} update_time_entry={update_time_entry} time_entry={time_entry}/> )}
        </div>
    )
}

export default DayTable
