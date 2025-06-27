import { ACCOUNT_TYPE } from "./../src/utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Live Classes",
    path: "/dashboard/live-classes",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscBroadcast",
  },
  {
    id: 5,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 6,
    name: "Add Live Class",
    path: "/dashboard/add-live-class",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscCalendar",
  },
  {
    id: 7,
    name: "E-books",
    path: "/dashboard/e-books",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscBook",
  },
  {
    id: 8,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 9,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
];
