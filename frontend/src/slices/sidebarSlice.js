import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openSideMenu: false,
  screenSize: undefined,
  courseViewSidebar: false,
};
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenSideMenu: (state, action) => {
      state.openSideMenu = action.payload;
    },
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setCourseViewSidebar: (state, action) => {
      state.courseViewSidebar = action.payload;
    },
  },
});

export const { setOpenSideMenu, setScreenSize, setCourseViewSidebar } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
