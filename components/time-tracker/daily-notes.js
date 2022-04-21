import React, { useEffect, useRef } from "react";
import _ from "lodash";
import "./time-tracker.module.scss";

const DailyNotes = ({ notes, set_notes }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = !notes ? "" : notes;
  }, [notes]);

  function handle_change(event) {
    event.persist();
    const handle_change_debounce = _.debounce((e) => {
      set_notes(e.target.value);
    }, 500);
    handle_change_debounce(event);
  }

  return (
    <React.Fragment>
      <h4 className="mt-5 text-light">Daily notes</h4>
      <textarea
        ref={inputRef}
        className="DailyNotes"
        onChange={handle_change}
      ></textarea>
    </React.Fragment>
  );
};

export default DailyNotes;
