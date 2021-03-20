import React from 'react'

const DatePicker = ({ set_date, date }) => {
    function on_change(e) {
        const date = e.target.value
        set_date(date)
    }
  
    return (
        <input type="date" value={date} onChange={on_change}/>
    )
}

export default DatePicker;