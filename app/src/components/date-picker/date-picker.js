import React from 'react'
import './date-picker.scss'

const DatePicker = ({ set_date, date }) => {
    function on_change(e) {
        const date = e.target.value
        set_date(date)
    }
  
    return (
        <input className="DatePicker" type="date" value={date} onChange={on_change}/>
    )
}

export default DatePicker;