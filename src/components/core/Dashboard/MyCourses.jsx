import { useEffect, useState } from "react"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../services/operations/courseDetailsAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import { formatPrice } from "../../Common/CourseCard"
import { EmptyState, ErrorState, LoadingState } from "../../Common/PageState"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [revision, setRevision] = useState(0),
    [filter, setFilter] = useState("all"),
    [confirmation, setConfirmation] = useState(null)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    fetchInstructorCourses(token)
      .then((result) => {
        if (!Array.isArray(result)) throw new Error("Unavailable courses")
        if (active) setCourses(result)
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
  const remove = async (course) => {
    setConfirmation(null)
    setLoading(true)
    try {
      await deleteCourse({ courseId: course._id }, token)
    } finally {
      setRevision((value) => value + 1)
    }
  }
  const filtered = courses.filter(
    (course) => filter === "all" || course.status === filter
  )
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">EXPERIENCE WORTH SHARING</span>
          <h1>Your courses. Their possibilities.</h1>
          <p>Create, refine, and share the things you know best.</p>
        </div>
        <Link className="button button-primary" to="/dashboard/add-course">
          Create a course
        </Link>
      </header>
      <div className="filter-tabs" aria-label="Course publication status">
        {[
          ["all", "All courses"],
          ["Published", "Published"],
          ["Draft", "Drafts"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={filter === value ? "selected" : ""}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingState message="Opening your courses…" />
      ) : error ? (
        <ErrorState retry={() => setRevision((value) => value + 1)} />
      ) : !filtered.length ? (
        <EmptyState
          title={
            courses.length
              ? "Nothing here just yet."
              : "Your experience could be someone’s breakthrough."
          }
          description={
            courses.length
              ? "Try a different publication filter to find your courses."
              : "Start with a topic you know well. Add your first course and make room for someone to learn."
          }
          action={
            courses.length ? "Show all courses" : "Create my first course"
          }
          onClick={courses.length ? () => setFilter("all") : undefined}
          to="/dashboard/add-course"
        />
      ) : (
        <div className="enrolled-grid">
          {filtered.map((course) => (
            <article key={course._id} className="enrolled-card">
              <img src={course.thumbnail} alt="" />
              <div className="enrolled-card-body">
                <span className="profile-badge">
                  {course.status === "Published"
                    ? "Published"
                    : "Draft · Only visible to you"}
                </span>
                <h2>{course.courseName}</h2>
                <p>
                  {course.studentsEnroled?.length || 0} learners ·{" "}
                  {formatPrice(course.price)}
                </p>
                <div className="course-management-actions">
                  <Link
                    className="button button-secondary"
                    to={`/dashboard/edit-course/${course._id}`}
                  >
                    <FiEdit2 />
                    Edit course
                  </Link>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${course.courseName}`}
                    onClick={() =>
                      setConfirmation({
                        text1: "Delete this course?",
                        text2: `“${course.courseName}” and its lessons will be permanently removed. This can’t be undone.`,
                        btn1Text: "Delete course",
                        btn2Text: "Keep course",
                        btn1Handler: () => remove(course),
                        btn2Handler: () => setConfirmation(null),
                      })
                    }
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {confirmation && <ConfirmationModal modalData={confirmation} />}
    </>
  )
}
