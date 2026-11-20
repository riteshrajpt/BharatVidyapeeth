import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import { ErrorState, LoadingState } from "../components/Common/PageState"
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams(),
    { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    getFullDetailsOfCourse(courseId, token)
      .then((data) => {
        if (!data?.courseDetails) throw new Error("Course unavailable")
        if (!active) return
        const sections = data.courseDetails.courseContent || []
        dispatch(setCourseSectionData(sections))
        dispatch(setEntireCourseData(data.courseDetails))
        dispatch(setCompletedLectures(data.completedVideos || []))
        dispatch(
          setTotalNoOfLectures(
            sections.reduce(
              (sum, section) => sum + (section.subSection?.length || 0),
              0
            )
          )
        )
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
  }, [courseId, token, dispatch, revision])
  if (loading) return <LoadingState message="Getting your next lesson ready…" />
  if (error)
    return (
      <ErrorState
        retry={() => setRevision((value) => value + 1)}
        message="We couldn’t open this course. Check that you’re enrolled and try again."
      />
    )
  return (
    <>
      <div className="lesson-layout">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="lesson-content">
          <Outlet />
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
