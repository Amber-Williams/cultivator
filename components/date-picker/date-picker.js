import React from "react";
import moment from "moment";
import styles from "./date-picker.module.scss";

const DatePicker = ({ set_date, date }) => {
  function on_change(e) {
    set_date(e.target.value);
  }

  return (
    <input
      className={styles.DatePicker}
      type="date"
      value={moment(date).format("YYYY-MM-DD")}
      onChange={on_change}
    />
  );
};

export default DatePicker;
