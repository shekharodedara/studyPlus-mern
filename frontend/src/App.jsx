import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from "./pages/CourseDetails";
import Catalog from "./pages/Catalog";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor";
import Cart from "./components/core/Dashboard/Cart/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import { ACCOUNT_TYPE } from "./utils/constants";
import { HiArrowNarrowUp } from "react-icons/hi";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import PurchasedBooks from "./components/core/Dashboard/PurchasedBooks";
import PurchaseHistory from "./components/core/Dashboard/PurchaseHistory";
import AddLiveClass from "./components/core/Dashboard/AddLiveClass/AddLiveClass";
import MyLiveClasses from "./components/core/Dashboard/MyLiveClasses";
import LiveClasses from "./pages/LiveClasses";
import LiveClassDetails from "./pages/LiveClassDetails";
import PurchasedLiveClasses from "./components/core/Dashboard/PurchasedLiveClasses";
import LiveClassRoom from "./components/core/Dashboard/LiveClassRoom";
import LiveClassNotification from "./components/common/LiveClassNotification";
import {
  getInstructorLiveClasses,
  getUserPurchasedLiveClasses,
} from "./services/operations/liveClassesApi";
import ChatBot from "./components/common/ChatBot";

function App() {
  const { user, token } = useSelector((state) => ({
    user: state.profile.user,
    token: state.auth.token,
  }));
  const [liveClasses, setLiveClasses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

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
          <Route path="dashboard/room/:roomCode" element={<LiveClassRoom />} />
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
      {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && (
          <ChatBot token={token} navigate={navigate} />
        )}
    </div>
  );
}

export default App;
