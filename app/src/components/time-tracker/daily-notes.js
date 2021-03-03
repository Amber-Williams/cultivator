import React, { useEffect, useRef } from 'react'
import _ from 'lodash';
import './time-tracker.css'

const DailyNotes = ({ notes, set_notes }) => {
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.value = notes;
    }, [])

    function handleChange(event) {
        event.persist();
        const handleChangeDebounce = _.debounce((e) => { 
            set_notes(e.target.value)
        }, 1000);
        handleChangeDebounce(event);
    }

    return <textarea ref={inputRef} className="DailyNotes" onChange={handleChange}></textarea>
}

export default DailyNotes
