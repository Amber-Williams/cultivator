import React, { useState, useEffect } from 'react'
import { invert_color } from './../../utilities/style'
import "./time-tracker.css"

const Interval = ({ index, main, type, update_time_entry, time_entry, entry_types }) => {
    const [ style, set_style ] = useState(null)
    const interval_naming = [main, '15', '30', '45']
    const id = `${main}:${index === 0 ? '00': interval_naming[index]}`

    function set_empty(){
        set_style({
            backgroundColor: '#FFFFFF',
            color: invert_color('#FFFFFF', true)
        })
    }
    useEffect(() => {
        set_empty()
    }, [])

    useEffect(() => {
        // sets time cell registered entry type with color
        if (time_entry[id]) {
            const color = entry_types[time_entry[id]]?.color || '#FFFFFF'
            set_style({
                backgroundColor: color,
                color: invert_color(color, true)
            })
        } else {
            set_empty()
        }
    }, [time_entry[id], entry_types[time_entry[id]]])

    function select(e) {
        type.name === 'none' ? update_time_entry(e.target.id, null) :  update_time_entry(e.target.id, type.name)
    }

    return <div id={id}
                onClick={select}
                onMouseDown={select}
                style={style}
                className={index === 0 ? 'Interval Interval--main' : 'Interval'}>
                    {interval_naming[index]}
            </div>
}

const Hour = ({ index, type, update_time_entry, time_entry, entry_types }) => (
    <div className="Hour d-flex">
        {[...Array(4)].map((_, i) =>  <Interval key={i} 
                                                index={i} main={index + 1} 
                                                type={type} 
                                                update_time_entry={update_time_entry} t
                                                time_entry={time_entry}
                                                entry_types={entry_types}/> )}
    </div>
)

const DayTable = ({ type, update_time_entry, time_entry, entry_types }) => {
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <Hour key={i} 
                                        index={i} 
                                        type={type} 
                                        update_time_entry={update_time_entry} 
                                        time_entry={time_entry}
                                        entry_types={entry_types}/> )}
        </div>
    )
}

export default DayTable
