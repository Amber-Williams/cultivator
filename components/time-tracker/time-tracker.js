import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

import { setEntryTypes, setSelectedDate } from "./time-tracker-slice";
import { times } from "./../../utils/times";
import TypePicker from "../type-picker/type-picker";
import DatePicker from "./../date-picker/date-picker";
import DayTable from "./day-table";
import DailyNotes from "./daily-notes";
import styles from "./time-tracker.module.scss";

const TimeTracker = ({ API }) => {
  const selectedDate = useSelector(
    (state) => state.timeTackerState.selectedDate.value
  );
  const entryTypes = useSelector(
    (state) => state.timeTackerState.entryTypes.value
  );
  const dispatch = useDispatch();

  const [type, set_type] = useState("work");
  const [time_entry, set_time_entry] = useState(null);
  const [notes, set_notes] = useState(null);
  const [loading, set_loading] = useState(true);
  const [api_loading, set_api_loading] = useState(false);

  const stateRef = useRef();
  stateRef.current = { selectedDate, time_entry, notes }; // gets current state outside of api scope

  useEffect(() => {
    API.get("api", "/entry-type")
      .then((entryTypes) => {
        dispatch(setEntryTypes(entryTypes));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    set_api_loading(true);

    API.get("api", `/entry?date=${moment(selectedDate).format("YYYY-MM-DD")}`)
      .then((data) => {
        if (data["_id"]) {
          data.time_entry
            ? set_time_entry(data.time_entry)
            : set_time_entry(times);
          data.notes ? set_notes(data.notes) : set_notes("");
        } else {
          set_time_entry(times);
          set_notes("");
        }
        set_api_loading(false);
        set_loading(false);
      })
      .catch((err) => console.log(err)); // TODO: error state
  }, [selectedDate]);

  useEffect(() => {
    if (loading) return;
    send_entry();
  }, [notes]);

  const update_time_entry = async (time, type) => {
    if (loading) return;
    const time_entry_copy = JSON.parse(JSON.stringify(time_entry));
    time_entry_copy[time] = type ? type : null;
    set_time_entry(time_entry_copy);
    send_entry();
  };

  const update_hour_entry = async (hour, type) => {
    if (loading) return;
    const time_entry_copy = JSON.parse(JSON.stringify(time_entry));
    time_entry_copy[hour + ":00"] = type ? type : null;
    time_entry_copy[hour + ":15"] = type ? type : null;
    time_entry_copy[hour + ":30"] = type ? type : null;
    time_entry_copy[hour + ":45"] = type ? type : null;
    set_time_entry(time_entry_copy);
    send_entry();
  };

  const send_entry = async () => {
    if (!api_loading) {
      set_api_loading(true);
      const date = moment(stateRef.current.date).format("YYYY-MM-DD");

      API.post("api", "/entry", {
        body: {
          date,
          time_entry: stateRef.current.time_entry,
          notes: stateRef.current.notes,
        },
      })
        .then((data) => {
          const sent_time_entry = data?.data?.time_entry;
          const sent_notes = data?.data?.notes;
          const sent_date = data?.data?.date;
          const current_date = moment(stateRef.current.date).format(
            "YYYY-MM-DD"
          );

          if (current_date !== sent_date) {
            // BUG TODO:  if user uses keyboard to change dates too fast it will save over other dates
            console.log("dates are out of sync, submitting new POST /entry");
            set_api_loading(false);
            return;
          }

          const same_states =
            _.isEqual(stateRef.current.time_entry, sent_time_entry) &&
            _.isEqual(stateRef.current.notes, sent_notes); // check frontend and backend states are synced
          set_api_loading(false);

          if (!same_states) {
            console.log("states out of sync updating");
            setTimeout(send_entry.bind(this), 500);
          }
        })
        .catch((err) => {
          // TODO: error state
          set_api_loading(false);
          console.error("Error sending entry", err);
        });
    }
  };

  const onDateChange = (date) => {
    if (date.length > 0 && date !== selectedDate) {
      dispatch(setSelectedDate(date));
    }
  };

  if (!loading && entryTypes) {
    return (
      <div className={styles.TimeTracker}>
        <DatePicker date={selectedDate} set_date={onDateChange} />
        <TypePicker set_type={set_type} />
        <DayTable
          type={type}
          update_time_entry={update_time_entry}
          update_hour_entry={update_hour_entry}
          time_entry={time_entry}
          entry_types={entryTypes}
        />
        <DailyNotes set_notes={set_notes} notes={notes} />
      </div>
    );
  } else {
    return <div className="spinner-border text-light" role="status"></div>;
  }
};

export default TimeTracker;
