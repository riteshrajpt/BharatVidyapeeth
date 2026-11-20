import { Suspense, lazy, useEffect } from "react"

import "./App.css"
import "./styles/redesign.css"
import "./styles/workspace.css"
import "./styles/responsive.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"

// Components
import Navbar from "./components/Common/Navbar"
import { LoadingState } from "./components/Common/PageState"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Error from "./pages/Error"
// Pages
import Home from "./pages/Home"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"

const About = lazy(() => import("./pages/About"))
const Courses = lazy(() => import("./pages/Courses"))
const Catalog = Courses
const Contact = lazy(() => import("./pages/Contact"))
const CourseDetails = lazy(() => import("./pages/CourseDetails"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"))
const Settings = lazy(() => import("./components/core/Dashboard/Settings"))
const EnrolledCourses = lazy(() =>
  import("./components/core/Dashboard/EnrolledCourses")
)
const Cart = lazy(() => import("./components/core/Dashboard/Cart"))
const Instructor = lazy(() => import("./components/core/Dashboard/Instructor"))
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"))
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse"))
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"))
const ViewCourse = lazy(() => import("./pages/ViewCourse"))
const VideoDetails = lazy(() =>
  import("./components/core/ViewCourse/VideoDetails")
)

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    const titles = {
      "/": "A little learning. A bigger future.",
      "/courses": "Explore courses",
      "/about": "Our story",
      "/contact": "Get in touch",
      "/login": "Welcome back",
      "/signup": "Start your next chapter",
      "/forgot-password": "Reset your password",
    }
    document.title = `${
      titles[location.pathname] ||
      (location.pathname.startsWith("/dashboard")
        ? "Your learning space"
        : "Keep your curiosity alive")
    } | BharatVidyapeeth`
  }, [location.pathname])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route
              path="/catalog"
              element={<Navigate to="/courses" replace />}
            />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="catalog/:catalogName" element={<Catalog />} />
            {/* Open Route - for Only Non Logged in User */}
            <Route
              path="login"
              element={
                <OpenRoute>
                  <Login />
                </OpenRoute>
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
              path="update-password/:id"
              element={
                <OpenRoute>
                  <UpdatePassword />
                </OpenRoute>
              }
            />
            <Route
              path="signup"
              element={
                <OpenRoute>
                  <Signup />
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
            {/* Private Route - for Only Logged in User */}
            <Route
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              {/* Route for all users */}
              <Route
                path="dashboard"
                element={<Navigate to="/dashboard/my-profile" replace />}
              />
              <Route path="dashboard/my-profile" element={<MyProfile />} />
              {/* Route only for Instructors */}
              {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <Route path="dashboard/instructor" element={<Instructor />} />
                  <Route path="dashboard/my-courses" element={<MyCourses />} />
                  <Route path="dashboard/add-course" element={<AddCourse />} />
                  <Route
                    path="dashboard/edit-course/:courseId"
                    element={<EditCourse />}
                  />
                </>
              )}
              {/* Route only for Students */}
              {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="dashboard/enrolled-courses"
                    element={<EnrolledCourses />}
                  />
                  <Route path="/dashboard/cart" element={<Cart />} />
                </>
              )}
              <Route path="dashboard/settings" element={<Settings />} />
            </Route>

            {/* For the watching course lectures */}
            <Route
              element={
                <PrivateRoute>
                  <ViewCourse />
                </PrivateRoute>
              }
            >
              {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element={<VideoDetails />}
                  />
                </>
              )}
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
