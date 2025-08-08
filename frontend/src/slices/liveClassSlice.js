import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  liveClass: {
    recurrence: [],
  },
  editLiveClass: false,
  loading: false,
};

const liveClassSlice = createSlice({
  name: "liveClass",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setLiveClass: (state, action) => {
      state.liveClass = action.payload;
    },
    setEditLiveClass: (state, action) => {
      state.editLiveClass = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetLiveClassState: (state) => {
      state.step = 1;
      state.liveClass = null;
      state.editLiveClass = false;
      state.loading = false;
    },
  },
});

export const {
  setStep,
  setLiveClass,
  setEditLiveClass,
  setLoading,
  resetLiveClassState,
} = liveClassSlice.actions;

export default liveClassSlice.reducer;
