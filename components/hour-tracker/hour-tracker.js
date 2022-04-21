import React, { useState, useEffect } from "react";
import { invert_color } from "./../../utils/style";
import "./hour-tracker.module.scss";

const Interval = ({
  index,
  main,
  type,
  update_time_entry,
  time_entry,
  entry_types,
}) => {
  const [style, set_style] = useState(null);

  const interval_naming = ["00", "15", "30", "45"];
  const id = `${main}:${interval_naming[index]}`;

  function set_empty() {
    set_style({
      backgroundColor: "#FFFFFF",
      color: invert_color("#FFFFFF", true),
    });
  }

  useEffect(() => {
    set_empty();
  }, []);

  useEffect(() => {
    // sets time cell registered entry type with color
    if (time_entry[id] && entry_types) {
      const color = entry_types[time_entry[id]]?.color || "#FFFFFF";
      set_style({
        backgroundColor: color,
        color: invert_color(color, true),
      });
    } else {
      set_empty();
    }
  }, [time_entry[id], entry_types[time_entry[id]]]);

  function select(e) {
    type.name === "none"
      ? update_time_entry(e.target.id, null)
      : update_time_entry(e.target.id, type.name);
  }

  return (
    <div
      id={id}
      onClick={select}
      onMouseDown={select}
      style={style}
      className={`Interval ${index === 3 ? "Interval--last" : ""}`}
    >
      <p>:{interval_naming[index]}</p>
    </div>
  );
};

const HourTracker = ({
  main,
  type,
  update_time_entry,
  update_hour_entry,
  time_entry,
  entry_types,
}) => {
  function select(e) {
    type.name === "none"
      ? update_hour_entry(e.target.id, null)
      : update_hour_entry(e.target.id, type.name);
  }

  return (
    <div className="HourTracker d-flex align-items-center justify-content-center">
      <div className="HourTracker__main" id={main} onClick={select}>
        <h4>{main % 12 === 0 ? "12" : main % 12}</h4>
        <p>{main < 12 || main === 0 ? "A.M." : "P.M."}</p>
      </div>

      <div className="d-flex flex-column align-items-center h-100">
        {[...Array(4)].map((_, i) => (
          <Interval
            key={i}
            index={i}
            main={main}
            type={type}
            update_time_entry={update_time_entry}
            time_entry={time_entry}
            entry_types={entry_types}
          />
        ))}
      </div>
    </div>
  );
};

export default HourTracker;
