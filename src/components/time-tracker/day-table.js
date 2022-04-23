import React, { useState } from 'react'

import HourTracker from './../hour-tracker/hour-tracker'
import SunIcon from '../../images/icons/sun'
import MoonIcon from '../../images/icons/moon'

import "./time-tracker.scss"


const DayTable = ({ type, update_time_entry, update_hour_entry, time_entry, entry_types }) => {
    const [isAM, setIsAM ] = useState(true)
    const hours = [...Array(24)]
    
    return (
        <div className="DayTable">
            <div class="form-check form-switch" onClick={() => setIsAM(!isAM)}>
                <p class="text-light">
                    <SunIcon/>
                </p>
                <input class="form-check-input" type="checkbox" checked={isAM} />
                <p class="text-light">
                    <MoonIcon/>
                </p>
            </div>
            <div className="DayTable__HourTackerList">
                {hours.map((_, i) => {
                    if (isAM && i > 11) {
                        return;
                    } else if (!isAM && i < 12){
                        return;
                    }

                    return <HourTracker key={i} 
                                            main={i + 1 === 24 ? 0 : i + 1} //counts from 1 to 24 hours 1:00 -> 0:00
                                            type={type} 
                                            update_time_entry={update_time_entry} 
                                            update_hour_entry={update_hour_entry}
                                            time_entry={time_entry}
                                            entry_types={entry_types}/>} )}
            </div>
        </div>
    )
}

export default DayTable
