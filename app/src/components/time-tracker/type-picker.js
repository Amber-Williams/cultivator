import React from 'react'
import { types } from './types'

const TypePicker = ({ set_type }) => {
    // TODO: Get types
    // TODO: Set types

    function handler(e) {
        set_type(e.target.innerText)
        
        const types = document.querySelectorAll('.TypePicker div');
        types.forEach(t => t.style.border = 'none');

        if (e.target.innerText === 'waste')
            e.target.style.border = '1px solid blue'
        else 
            e.target.style.border = '1px solid red'
    }

    return (
        <div className="TypePicker">
            <div style={{backgroundColor: types.work, color: 'white'}} onClick={handler}>work</div>
            <div style={{backgroundColor: types.waste}} onClick={handler}>waste</div>
            <div style={{backgroundColor: types.learning}} onClick={handler}>learning</div>
            <div style={{backgroundColor: types.productive}} onClick={handler}>productive</div>
            <div style={{backgroundColor: types.sleep}} onClick={handler}>sleep</div>
            <div style={{backgroundColor: types.finance}} onClick={handler}>finance</div>
            <div style={{backgroundColor: types.cultivator}} onClick={handler}>cultivator</div>
            <div style={{backgroundColor: types.none, border: '1px solid red'}} onClick={handler}>none</div>
        </div>
    )
}

export default TypePicker
