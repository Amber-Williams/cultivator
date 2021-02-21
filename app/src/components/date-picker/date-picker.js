import React from 'react'

const DatePicker = ({ on_change, date }) => (
    <input type="date" value={date} onChange={on_change}/>
)

export default DatePicker;