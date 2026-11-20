import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { EmptyState, ErrorState, LoadingState } from "../../Common/PageState"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    getUserEnrolledCourses(token)
      .then((result) => {
        if (!Array.isArray(result)) throw new Error("Unavailable courses")
        if (active)
          setCourses(result.filter((course) => course.status !== "Draft"))
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
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">ONE LESSON CLOSER</span>
          <h1>Your learning, your way.</h1>
          <p>Pick up where you left off. There’s something good ahead.</p>
        </div>
        <Link to="/courses" className="button button-secondary">
          Explore more skills
        </Link>
      </header>
      {loading ? (
        <LoadingState message="Finding your learning journey…" />
      ) : error ? (
        <ErrorState retry={() => setRevision((value) => value + 1)} />
      ) : !courses.length ? (
        <EmptyState
          title="Every journey has a first course."
          description="Choose something you’ve always wanted to learn. Your enrolled courses will be right here, ready when you are."
          action="Find my first course"
        />
      ) : (
        <div className="enrolled-grid">
          {courses.map((course) => {
            const section = course.courseContent?.find(
              (item) => item.subSection?.length
            )
            const lesson = section?.subSection?.[0]
            const progress = Math.min(
              100,
              Math.max(0, Number(course.progressPercentage) || 0)
            )
            const path = lesson
              ? `/view-course/${course._id}/section/${section._id}/sub-section/${lesson._id}`
              : `/courses/${course._id}`
            return (
              <article className="enrolled-card" key={course._id}>
                <img src={course.thumbnail} alt="" />
                <div className="enrolled-card-body">
                  <span className="eyebrow">
                    {progress === 100
                      ? "LOOK HOW FAR YOU’VE COME"
                      : "YOUR NEXT LITTLE BREAKTHROUGH"}
                  </span>
                  <h2>{course.courseName}</h2>
                  <p>{course.totalDuration || "Learn at your own pace"}</p>
                  <div className="enrolled-progress">
                    <span>Your progress</span>
                    <strong>{Math.round(progress)}%</strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label={`${course.courseName} progress`}
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <Link to={path} className="button button-primary">
                    {lesson
                      ? progress === 100
                        ? "Revisit this course"
                        : progress > 0
                        ? "Continue learning"
                        : "Start my first lesson"
                      : "View course details"}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
