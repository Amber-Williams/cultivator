import React from 'react'
import HourTracker from './../hour-tracker/hour-tracker'
import "./time-tracker.scss"


const DayTable = ({ type, update_time_entry, update_hour_entry, time_entry, entry_types }) => {
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            {hours.map((_, i) =>  <HourTracker key={i} 
                                        main={i + 1 === 24 ? 0 : i + 1} //counts from 1 to 24 hours 1:00 -> 0:00
                                        type={type} 
                                        update_time_entry={update_time_entry} 
                                        update_hour_entry={update_hour_entry}
                                        time_entry={time_entry}
                                        entry_types={entry_types}/> )}
        </div>
    )
}

export default DayTable
