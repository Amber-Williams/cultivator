import { configureStore } from "@reduxjs/toolkit";
import timeTrackerSliceReducer from "../components/time-tracker/time-tracker-slice";

export default configureStore({
  reducer: {
    timeTackerState: timeTrackerSliceReducer,
  },
});
