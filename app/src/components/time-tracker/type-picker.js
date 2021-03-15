import React from 'react'
import { invert_color } from './../../utilities/style'

const TypePicker = ({ set_type, type_list }) => {
    function handler(e) {
        set_type(e.target.innerText)
        const types = document.querySelectorAll('.TypePicker div');
        types.forEach(t => {
            t.style.border = 'none'
            t.style.margin = '0'
            t.style.padding = '0'
        });
        e.target.style.border = `1px solid ${e.target.style.color}`;
        e.target.style.marginTop = `5px`;
        e.target.style.marginBottom = `5px`;
        e.target.style.paddingTop = `3px`;
        e.target.style.paddingBottom = `3px`;
    }

    

    return (
        <div className="TypePicker">
            {type_list 
                    ? type_list.map((type, i) => <div style={{backgroundColor: type.color, color: invert_color(type.color, true)}}
                                                      onClick={handler} 
                                                      key={i}>
                                                          {type.name}
                                                 </div>)
                    : null
            }
        </div>
    )
}

export default TypePicker
