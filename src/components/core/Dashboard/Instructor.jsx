import { useEffect, useState } from "react"
import { FiBookOpen, FiDollarSign, FiUsers } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import { formatPrice } from "../../Common/CourseCard"
import { EmptyState, ErrorState, LoadingState } from "../../Common/PageState"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth),
    { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [courses, setCourses] = useState([]),
    [stats, setStats] = useState([]),
    [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    Promise.all([getInstructorData(token), fetchInstructorCourses(token)])
      .then(([data, result]) => {
        if (!Array.isArray(result)) throw new Error("Unavailable courses")
        if (active) {
          setStats(Array.isArray(data) ? data : [])
          setCourses(result)
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
  }, [token, revision])
  const income = stats.reduce(
      (sum, course) => sum + (course.totalAmountGenerated || 0),
      0
    ),
    students = stats.reduce(
      (sum, course) => sum + (course.totalStudentsEnrolled || 0),
      0
    )
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">YOUR KNOWLEDGE MAKES A DIFFERENCE</span>
          <h1>Keep inspiring, {user?.firstName}.</h1>
          <p>
            A little of your experience. A world of possibility for someone
            else.
          </p>
        </div>
        <Link to="/dashboard/add-course" className="button button-primary">
          Create a course
        </Link>
      </header>
      {loading ? (
        <LoadingState message="Opening your teaching space…" />
      ) : error ? (
        <ErrorState retry={() => setRevision((value) => value + 1)} />
      ) : !courses.length ? (
        <EmptyState
          title="Your first course could be someone’s first step."
          description="Share something you know well. Organize your ideas, add your lessons, and help a curious mind move forward."
          action="Create my first course"
          to="/dashboard/add-course"
        />
      ) : (
        <>
          <div className="instructor-stats">
            {[
              [FiBookOpen, "Your courses", courses.length],
              [FiUsers, "Enrolled learners", students],
              [FiDollarSign, "Course earnings", formatPrice(income)],
            ].map(([Icon, label, value]) => (
              <div className="surface-card" key={label}>
                <span className="note-icon">
                  <Icon />
                </span>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="surface-card">
            <div className="surface-heading">
              <h2>Your teaching at a glance</h2>
            </div>
            {income > 0 || students > 0 ? (
              <InstructorChart courses={stats} />
            ) : (
              <p>
                Your insights will take shape as learners enroll in your
                courses.
              </p>
            )}
          </div>
          <div className="surface-heading">
            <h2>Your latest courses</h2>
            <Link className="text-link" to="/dashboard/my-courses">
              Manage all courses
            </Link>
          </div>
          <div className="enrolled-grid">
            {courses.slice(0, 4).map((course) => (
              <article className="enrolled-card" key={course._id}>
                <img src={course.thumbnail} alt="" />
                <div className="enrolled-card-body">
                  <span className="eyebrow">{course.status}</span>
                  <h2>{course.courseName}</h2>
                  <p>
                    {course.studentsEnroled?.length || 0} enrolled learners ·{" "}
                    {formatPrice(course.price)}
                  </p>
                  <Link
                    to={`/dashboard/edit-course/${course._id}`}
                    className="button button-secondary"
                  >
                    Manage this course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  )
}
