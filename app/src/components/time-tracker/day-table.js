import React from 'react'
import HourTracker from './../hour-tracker/hour-tracker'
import "./time-tracker.scss"


const DayTable = ({ type, update_time_entry, time_entry, entry_types }) => {
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <HourTracker key={i} 
                                        index={i} 
                                        type={type} 
                                        update_time_entry={update_time_entry} 
                                        time_entry={time_entry}
                                        entry_types={entry_types}/> )}
        </div>
    )
}

export default DayTable
