import { configureStore } from '@reduxjs/toolkit'
import entryTypesSliceReducer from '../components/time-tracker/entry-types-slice'

export default configureStore({
  reducer: {
    entry_types: entryTypesSliceReducer,
  },
})