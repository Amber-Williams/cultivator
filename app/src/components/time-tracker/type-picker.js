import React, { useState, useEffect } from 'react'
import { invert_color } from './../../utilities/style'
import { API } from 'aws-amplify'
import CirclePlusIcon from './../../images/icons/circle-plus'
import CircleMinusIcon from './../../images/icons/circle-minus'
import CircleArrowGoIcon from './../../images/icons/circle-arrow-go'

const TypePickerItem = ({ name, color, on_click, on_remove }) => (
    <div onClick={(e) => on_click(e, name, color)}
         className="d-flex justify-content-between align-items-center px-3"
         style={{ 
            backgroundColor: color, 
            color: invert_color(color, true)
        }}>
        <p className="m-0" >{name}</p>
        <div onClick={(e) => on_remove(e, name)}>
            <CircleMinusIcon width="16" height="16"/>
        </div>
    </div>
)

const TypePicker = ({ set_type, entry_types, set_entry_types }) => {
    const [ new_entry, set_new_entry ] = useState(null)
    const [ new_entry_color, set_new_entry_color ] = useState("#000000")
    const [ show_entry_editor, set_show_entry_editor ] = useState(false)

    function on_click(event, name, color) {
        set_type({ name, color })
        const types = document.querySelectorAll('.TypePicker div');
        types.forEach(t => {
            t.style.border = 'none'
            t.style.margin = '0'
            t.style.padding = '0'
        });
        event.currentTarget.style.border = `1px solid ${event.currentTarget.style.color}`;
        event.currentTarget.style.marginTop = `5px`;
        event.currentTarget.style.marginBottom = `5px`;
        event.currentTarget.style.paddingTop = `3px`;
        event.currentTarget.style.paddingBottom = `3px`;
    }

    function on_add() {
        console.log(new_entry, new_entry_color)
        API.post('api', '/entry-type', {
            body: {
              entry_type: {
                  name: new_entry,
                  color: new_entry_color
              }
            }
        })
        .then(data => {
            console.log(data)
            set_entry_types(data.data)
        })
    }

    function on_remove(event, entry_type) {
        event.stopPropagation()

        API.del('api', '/entry-type', {
            body: {
              entry_type
            }
        })
        .then(data => {
            console.log(data)
            set_entry_types(data.data)
        })
    }

    return (
        <div className="TypePicker">
            {entry_types 
                    ? Object.entries(entry_types).map((type, i) => <TypePickerItem name={type[0]} color={type[1].color} on_click={on_click} on_remove={on_remove} key={i}/>)
                    : null
            }
            <div className="border border-white text-light">
                { show_entry_editor 
                    ? <div className="d-flex justify-content-between align-items-center px-3"> 
                        <input type="text" onChange={(e) => set_new_entry(e.target.value)}/>
                        <input type="color" onChange={(e) => set_new_entry_color(e.target.value)}/>
                        <div onClick={on_add}>
                            <CircleArrowGoIcon width="16" height="16"/>
                        </div>
                        </div>
                    : <div onClick={() => set_show_entry_editor(true)} className="d-flex justify-content-between align-items-center px-3">
                        <p className="m-0"> Add entry type</p>
                        <CirclePlusIcon width="16" height="16"/>
                      </div>
                }
            </div>
        </div>
    )
}

export default TypePicker
