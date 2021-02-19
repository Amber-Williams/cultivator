import React from 'react'
import types from './types'
import "./time-tracker.css"

const Interval = ({ index, main, type }) => {
    const interval_naming = [main, '15', '30', '45'];

    function color_interval(e){
        e.target.style.backgroundColor = types[type]
    }

    return <div id={`${main}:${index === 0 ? '00': interval_naming[index]}`} 
                onClick={color_interval}
                className={index === 0 ? 'Interval Interval--main' : 'Interval'}>
                    {interval_naming[index]}
            </div>
}

const Hour = ({ index, type }) => (
    <div className="Hour d-flex">
        {[...Array(4)].map((_, i) =>  <Interval key={i} index={i} main={index + 1} type={type}/> )}
    </div>
)

const DayTable = ({type}) => {
    const hours = [...Array(24)];
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <Hour key={i} index={i} type={type}/> )}
        </div>
    )
}

export default DayTable
