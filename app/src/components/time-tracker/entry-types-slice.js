import { createSlice } from '@reduxjs/toolkit'

export const entryTypesSlice = createSlice({
  name: 'entry_types',
  initialState: {
    value: null,
  },
  reducers: {
    set_entry_types: (state, action) => {
        state.value = action.payload
        return state
    }
  },
})

export const { set_entry_types } = entryTypesSlice.actions

export default entryTypesSlice.reducer