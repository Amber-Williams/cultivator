import React, { useState, useEffect } from 'react'
import { invert_color } from './../../utilities/style'
import "./time-tracker.css"

const Interval = ({ index, main, type, update_time_entry, time_entry, type_list }) => {    
    const [ null_type, set_null_type ] = useState({ color: '#FFFFFF'})
    const [ style, set_style ] = useState(null)
    const interval_naming = [main, '15', '30', '45']
    const id = `${main}:${index === 0 ? '00': interval_naming[index]}`

    function set_empty(){
        set_style({
            backgroundColor: null_type.color,
            color: invert_color(null_type.color, true)
        })
    }
    useEffect(() => {
        const empty_color = type_list?.find(type => type.name === 'none')
        if (empty_color)
            set_null_type(empty_color)
        set_empty()
    }, [])

    useEffect(() => {
        if (time_entry[id]) {
            const type_obj = type_list?.find(type => type.name === time_entry[id]) || { color: '#FFFFFF'}
            set_style({
                backgroundColor: type_obj.color,
                color: invert_color(type_obj.color, true)
            })
        } else {
            set_empty()
        }
    }, [time_entry[id]])

    function select(e){
        type === 'none' ? update_time_entry(e.target.id, null) :  update_time_entry(e.target.id, type)
    }


    return <div id={id}
                onClick={select}
                onMouseDown={select}
                style={style}
                className={index === 0 ? 'Interval Interval--main' : 'Interval'}>
                    {interval_naming[index]}
            </div>
}

const Hour = ({ index, type, update_time_entry, time_entry, type_list }) => (
    <div className="Hour d-flex">
        {[...Array(4)].map((_, i) =>  <Interval key={i} 
                                                index={i} main={index + 1} 
                                                type={type} 
                                                update_time_entry={update_time_entry} t
                                                time_entry={time_entry}
                                                type_list={type_list}/> )}
    </div>
)

const DayTable = ({ type, update_time_entry, time_entry, type_list }) => {
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <Hour key={i} 
                                        index={i} 
                                        type={type} 
                                        update_time_entry={update_time_entry} 
                                        time_entry={time_entry} 
                                        type_list={type_list}/> )}
        </div>
    )
}

export default DayTable
