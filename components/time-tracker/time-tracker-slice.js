import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

export const timeTrackerSlice = createSlice({
  name: "timeTackerState",
  initialState: {
    entryTypes: {
      value: null,
    },
    selectedDate: {
      value: moment().format("YYYY-MM-DD"),
    },
  },
  reducers: {
    setEntryTypes: (state, action) => {
      state.entryTypes.value = action.payload;
      return state;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate.value = action.payload;
      return state;
    },
  },
});

export const { setEntryTypes, setSelectedDate } = timeTrackerSlice.actions;

export default timeTrackerSlice.reducer;
