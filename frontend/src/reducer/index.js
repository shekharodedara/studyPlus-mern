import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";
import profileReducer from "../slices/profileSlice";
import viewCourseReducer from "../slices/viewCourseSlice";
import sidebarSlice from "../slices/sidebarSlice";
import liveClassReducer from "../slices/liveClassSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
  sidebar: sidebarSlice,
  liveClass: liveClassReducer,
});

export default rootReducer;
