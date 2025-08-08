import React, { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiArrowNarrowUp } from "react-icons/hi";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import LiveClassNotification from "./components/common/LiveClassNotification";
import ChatBot from "./components/common/ChatBot";
import {
  getInstructorLiveClasses,
  getUserPurchasedLiveClasses,
} from "./services/operations/liveClassesApi";
import { ACCOUNT_TYPE } from "./utils/constants";
import useVersionPolling from "./utils/userVersionPolling";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"));
const Settings = lazy(() =>
  import("./components/core/Dashboard/Settings/Settings")
);
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"));
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"));
const Instructor = lazy(() => import("./components/core/Dashboard/Instructor"));
const Cart = lazy(() => import("./components/core/Dashboard/Cart/Cart"));
const EnrolledCourses = lazy(() =>
  import("./components/core/Dashboard/EnrolledCourses")
);
const AddCourse = lazy(() =>
  import("./components/core/Dashboard/AddCourse/AddCourse")
);
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const VideoDetails = lazy(() =>
  import("./components/core/ViewCourse/VideoDetails")
);
const Books = lazy(() => import("./pages/Books"));
const BookDetails = lazy(() => import("./pages/BookDetails"));
const PurchasedBooks = lazy(() =>
  import("./components/core/Dashboard/PurchasedBooks")
);
const PurchaseHistory = lazy(() =>
  import("./components/core/Dashboard/PurchaseHistory")
);
const AddLiveClass = lazy(() =>
  import("./components/core/Dashboard/AddLiveClass/AddLiveClass")
);
const MyLiveClasses = lazy(() =>
  import("./components/core/Dashboard/MyLiveClasses")
);
const LiveClasses = lazy(() => import("./pages/LiveClasses"));
const LiveClassDetails = lazy(() => import("./pages/LiveClassDetails"));
const PurchasedLiveClasses = lazy(() =>
  import("./components/core/Dashboard/PurchasedLiveClasses")
);
const LiveClassRoom = lazy(() =>
  import("./components/core/Dashboard/LiveClassRoom")
);

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-richblack-900 text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-50"></div>
    </div>
  );
};

function App() {
  const { user, token } = useSelector((state) => ({
    user: state.profile.user,
    token: state.auth.token,
  }));
  const [liveClasses, setLiveClasses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { newVersionAvailable } = useVersionPolling();
  useEffect(() => {
    if (newVersionAvailable) {
      alert("A new version of this app is available. Please refresh the page.");
    }
  }, [newVersionAvailable]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showArrow, setShowArrow] = useState(false);
  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true);
    } else setShowArrow(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleArrow);
    return () => {
      window.removeEventListener("scroll", handleArrow);
    };
  }, [showArrow]);

  useEffect(() => {
    async function fetchLiveClasses() {
      if (!token) return;
      try {
        let res = [];
        if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
          res = await getInstructorLiveClasses(token);
        } else {
          res = await getUserPurchasedLiveClasses(token);
        }
        setLiveClasses(res || []);
      } catch (error) {
        console.error("Failed to fetch live classes", error);
      }
    }
    fetchLiveClasses();
  }, [token, user]);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <button
        onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-50 duration-500 ease-in-out ${
          showArrow ? "bottom-24" : "-bottom-24"
        }`}
      >
        <HiArrowNarrowUp />
      </button>
      <LiveClassNotification liveClasses={liveClasses} user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/live-classes" element={<LiveClasses />} />
          <Route path="/live-class/:id" element={<LiveClassDetails />} />
          <Route
            path="signup"
            element={
              // <OpenRoute>
              <Signup />
              // </OpenRoute>
            }
          />
          <Route
            path="login"
            element={
              // <OpenRoute>
              <Login />
              // </OpenRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />
          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />
            <Route
              path="dashboard/room/:roomCode"
              element={<LiveClassRoom />}
            />
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/e-books" element={<PurchasedBooks />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
                <Route
                  path="dashboard/enrolled-liveClasses"
                  element={<PurchasedLiveClasses />}
                />
                <Route
                  path="dashboard/purchase-history"
                  element={<PurchaseHistory />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route
                  path="dashboard/add-live-class"
                  element={<AddLiveClass />}
                />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/live-classes"
                  element={<MyLiveClasses />}
                />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
              </>
            )}
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <ViewCourse />
              </ProtectedRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && (
          <ChatBot token={token} navigate={navigate} />
        )}
    </div>
  );
}

export default App;
