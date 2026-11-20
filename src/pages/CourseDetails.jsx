import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { FiBookOpen, FiClock, FiGlobe, FiStar, FiUsers } from "react-icons/fi"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import Avatar from "../components/Common/Avatar"
import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import { ErrorState, LoadingState } from "../components/Common/PageState"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { apiConnector } from "../services/apiConnector"
import { courseEndpoints } from "../services/apis"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import { ACCOUNT_TYPE } from "../utils/constants"

export default function CourseDetails() {
  const { courseId } = useParams()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)
  const [isActive, setIsActive] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    setData(null)
    if (!/^[a-f\d]{24}$/i.test(courseId)) {
      setLoading(false)
      setError(true)
      return
    }
    apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, { courseId })
      .then((response) => {
        if (!response.data.success || !response.data.data?.courseDetails)
          throw new Error("Unavailable course")
        if (active) {
          setData(response.data.data)
          setIsActive(
            response.data.data.courseDetails.courseContent?.[0]?._id
              ? [response.data.data.courseDetails.courseContent[0]._id]
              : []
          )
        }
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [courseId, revision])
  if (loading || paymentLoading)
    return (
      <LoadingState
        message={
          paymentLoading
            ? "Getting your enrollment ready…"
            : "Opening your next chapter…"
        }
      />
    )
  if (error || !data)
    return (
      <>
        <ErrorState
          message="This course is unavailable right now. Check the link or try again."
          retry={() => setRevision((value) => value + 1)}
        />
        <div className="empty-state">
          <Link className="text-link" to="/courses">
            Back to all courses
          </Link>
        </div>
      </>
    )
  const course = data.courseDetails
  const sections = course.courseContent || []
  const lectures = sections.reduce(
    (sum, section) => sum + (section.subSection?.length || 0),
    0
  )
  const rating = GetAvgRating(course.ratingAndReviews || [])
  const handleBuyCourse = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
      return toast.error("Instructor accounts cannot purchase courses.")
    if (token) return BuyCourse(token, [courseId], user, navigate, dispatch)
    setConfirmationModal({
      text1: "Your next chapter starts with an account.",
      text2:
        "Log in to enroll in this course and keep all your learning in one place.",
      btn1Text: "Log in",
      btn2Text: "Keep exploring",
      btn1Handler: () =>
        navigate("/login", { state: { from: `/courses/${courseId}` } }),
      btn2Handler: () => setConfirmationModal(null),
    })
  }
  return (
    <>
      <section className="course-detail-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/courses">Explore courses</Link>
            <span>/</span>
            <span>{course.category?.name || "Course details"}</span>
          </div>
          <div className="course-detail-intro">
            <span className="eyebrow">
              {course.category?.name || "YOUR NEXT SKILL STARTS HERE"}
            </span>
            <h1>{course.courseName}</h1>
            <p>{course.courseDescription}</p>
            <div className="course-detail-meta">
              {Number.isFinite(rating) && rating > 0 && (
                <span>
                  <FiStar /> {rating} ({course.ratingAndReviews?.length}{" "}
                  reviews)
                </span>
              )}
              <span>
                <FiUsers /> {course.studentsEnroled?.length || 0} enrolled
              </span>
              <span>
                <FiBookOpen /> {lectures} lessons
              </span>
              <span>
                <FiGlobe /> English
              </span>
              {data.totalDuration && (
                <span>
                  <FiClock /> {data.totalDuration}
                </span>
              )}
            </div>
            <div className="course-author-line">
              <Avatar user={course.instructor} />
              <span>
                Learn with{" "}
                <strong>
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="course-detail-body">
        <div className="course-detail-layout container">
          <div className="course-detail-main">
            <div className="surface-card">
              <span className="eyebrow">TURN CURIOSITY INTO CAPABILITY</span>
              <h2 className="mt-3">What you’ll learn</h2>
              <div className="markdown-content">
                <ReactMarkdown>
                  {course.whatYouWillLearn ||
                    "Explore the course curriculum below to see what you’ll cover."}
                </ReactMarkdown>
              </div>
            </div>
            <div className="curriculum-heading">
              <div>
                <h2>Your learning path</h2>
                <p>
                  {sections.length} sections · {lectures} lessons
                  {data.totalDuration ? ` · ${data.totalDuration}` : ""}
                </p>
              </div>
              <button
                onClick={() =>
                  setIsActive(
                    isActive.length
                      ? []
                      : sections.map((section) => section._id)
                  )
                }
              >
                {isActive.length ? "Collapse all" : "Expand all"}
              </button>
            </div>
            {sections.length ? (
              sections.map((section) => (
                <CourseAccordionBar
                  key={section._id}
                  course={section}
                  isActive={isActive}
                  handleActive={(id) =>
                    setIsActive((current) =>
                      current.includes(id)
                        ? current.filter((item) => item !== id)
                        : [...current, id]
                    )
                  }
                />
              ))
            ) : (
              <p className="auth-description">
                The instructor is preparing the lesson outline.
              </p>
            )}
            <section className="instructor-detail">
              <h2>Your instructor</h2>
              <div className="course-author-line">
                <Avatar user={course.instructor} />
                <strong>
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </strong>
              </div>
              <p>
                {course.instructor?.additionalDetails?.about ||
                  "Sharing practical knowledge, one lesson at a time."}
              </p>
            </section>
          </div>
          <CourseDetailsCard
            course={course}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </section>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
