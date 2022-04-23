import React, { useState } from "react";

import HourTracker from "./../hour-tracker/hour-tracker";
import SunIcon from "./../svgs/sun";
import MoonIcon from "./../svgs/moon";
import styles from "./time-tracker.module.scss";

const DayTable = ({
  type,
  update_time_entry,
  update_hour_entry,
  time_entry,
  entry_types,
}) => {
  const [isAM, setIsAM] = useState(true);
  const hours = [...Array(24)];

  return (
    <div className={styles.DayTable}>
      <div
        className="d-flex justify-content-end form-check form-switch"
        onClick={() => setIsAM(!isAM)}
      >
        <p className="text-light">
          <SunIcon />
        </p>
        <input
          className={`${styles.DayTableSwitch} form-check-input`}
          type="checkbox"
          checked={isAM}
        />
        <p className="text-light">
          <MoonIcon />
        </p>
      </div>
      <div className={styles.DayTableHourTackerList}>
        {hours.map((_, i) => {
          if (isAM && i > 11) {
            return;
          } else if (!isAM && i < 12) {
            return;
          }

          return (
            <HourTracker
              key={i}
              main={i + 1 === 24 ? 0 : i + 1} //counts from 1 to 24 hours 1:00 -> 0:00
              type={type}
              update_time_entry={update_time_entry}
              update_hour_entry={update_hour_entry}
              time_entry={time_entry}
              entry_types={entry_types}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DayTable;
