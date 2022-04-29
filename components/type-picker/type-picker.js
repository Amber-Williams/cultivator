import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API } from "aws-amplify";

import { setEntryTypes } from "../time-tracker/time-tracker-slice";
import { invert_color } from "./../../utils/style";
import CirclePlusIcon from "./../svgs/circle-plus";
import CircleMinusIcon from "./../svgs/circle-minus";
import CircleArrowGoIcon from "./../svgs/circle-arrow-go";
import styles from "./type-picker.module.scss";

const TypePickerItem = ({ name, color, on_click, on_remove }) => (
  <div
    onClick={(e) => on_click(e, name, color)}
    className="d-flex justify-content-between align-items-center px-3"
    style={{
      backgroundColor: color,
      color: invert_color(color, true),
    }}
  >
    <p className="m-0">{name}</p>
    <div onClick={(e) => on_remove(e, name)}>
      <CircleMinusIcon width="16" height="16" />
    </div>
  </div>
);

const TypePicker = ({ set_type }) => {
  const entry_types = useSelector(
    (state) => state.timeTackerState.entryTypes.value
  );
  const dispatch = useDispatch();

  const [new_entry, set_new_entry] = useState(null);
  const [entry_color, set_entry_color] = useState("#0d6efd");
  const [show_entry_editor, set_show_entry_editor] = useState(false);
  const [error, set_error] = useState(false);

  function on_click(event, name, color) {
    set_type({ name, color });
    const types = document.querySelectorAll(".TypePicker div");
    types.forEach((t) => {
      t.style.border = "none";
      t.style.margin = "0";
      t.style.padding = "0";
    });
    event.currentTarget.style.border = `1px solid ${event.currentTarget.style.color}`;
    event.currentTarget.style.marginTop = `5px`;
    event.currentTarget.style.marginBottom = `5px`;
    event.currentTarget.style.paddingTop = `3px`;
    event.currentTarget.style.paddingBottom = `3px`;
  }

  function on_add() {
    set_error(false);

    if (!new_entry || new_entry.trim().length === 0) {
      set_error("Entry needs valid name");
      return;
    }

    API.post("api", "/entry-type", {
      body: {
        entry_type: {
          name: new_entry,
          color: entry_color,
        },
      },
    })
      .then((data) => {
        if (data.error) {
          set_error(data.error);
          return;
        }
        dispatch(setEntryTypes(data.data));
        set_show_entry_editor(false);
      })
      .catch((err) => console.log(err)); //TODO: error handling
  }

  function on_remove(event, entry_type) {
    event.stopPropagation();
    set_error(false);

    API.del("api", "/entry-type", {
      body: {
        entry_type,
      },
    }).then((data) => {
      dispatch(setEntryTypes(data.data));
    });
  }

  return (
    <div className={styles.TypePicker}>
      <div className={styles.TypePickerEntries}>
        {entry_types
          ? Object.entries(entry_types).map((type, i) => (
              <TypePickerItem
                name={type[0]}
                color={type[1].color}
                on_click={on_click}
                on_remove={on_remove}
                key={i}
              />
            ))
          : null}
      </div>
      <div>
        {show_entry_editor ? (
          <div className="d-flex justify-content-between align-items-center">
            <input
              type="text"
              placeholder="Enter name"
              className={`${styles.TypePickerEntryInput} form-control`}
              onChange={(e) => set_new_entry(e.target.value)}
            />
            <input
              type="color"
              className={`${styles.TypePickerColorInput} form-control form-control-color`}
              value={entry_color}
              onChange={(e) => set_entry_color(e.target.value)}
            />
            <div onClick={on_add} className="text-light">
              <CircleArrowGoIcon width="16" height="16" />
            </div>
          </div>
        ) : (
          <div
            onClick={() => set_show_entry_editor(true)}
            className={`${styles.TypePickerAddButton} d-flex justify-content-between align-items-center px-3`}
          >
            <CirclePlusIcon width="16" height="16" />
          </div>
        )}
      </div>
      <p className="text-danger text-center">{error}</p>
    </div>
  );
};

export default TypePicker;
