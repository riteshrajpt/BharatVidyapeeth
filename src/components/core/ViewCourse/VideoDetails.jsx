import { useEffect, useRef, useState } from "react"
import { FiCheckCircle } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { EmptyState } from "../../Common/PageState"

export default function VideoDetails() {
  const { courseId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)
  const navigate = useNavigate(),
    dispatch = useDispatch()
  const player = useRef(null)
  const [loading, setLoading] = useState(false)
  const [playbackFailed, setPlaybackFailed] = useState(false)
  useEffect(() => {
    setPlaybackFailed(false)
  }, [subSectionId])
  const lessons = courseSectionData.flatMap((section) =>
    (section.subSection || []).map((lesson) => ({
      ...lesson,
      sectionId: section._id,
    }))
  )
  const index = lessons.findIndex((lesson) => lesson._id === subSectionId),
    lesson = lessons[index]
  const path = (item) =>
    `/view-course/${courseId}/section/${item.sectionId}/sub-section/${item._id}`
  const complete = async () => {
    setLoading(true)
    try {
      const success = await markLectureAsComplete(
        { courseId, subsectionId: subSectionId },
        token
      )
      if (success) dispatch(updateCompletedLectures(subSectionId))
    } finally {
      setLoading(false)
    }
  }
  if (!lesson)
    return (
      <EmptyState
        title="This lesson isn’t available."
        description="Choose a lesson from your course outline to continue learning."
        action="Back to my courses"
        to="/dashboard/enrolled-courses"
      />
    )
  const completed = completedLectures.includes(subSectionId)
  return (
    <div className="lesson-view" key={subSectionId}>
      <div className="lesson-top-actions">
        <span className="eyebrow">
          LESSON {index + 1} OF {lessons.length}
        </span>
        <span className="lesson-status">
          {completed ? (
            <>
              <FiCheckCircle />
              Completed
            </>
          ) : (
            "A little progress, every day."
          )}
        </span>
      </div>
      {lesson.videoUrl && !playbackFailed ? (
        <video
          className="lesson-video"
          controls
          playsInline
          preload="metadata"
          poster={courseEntireData.thumbnail}
          src={lesson.videoUrl}
          ref={player}
          onError={() => setPlaybackFailed(true)}
          onLoadStart={() => setPlaybackFailed(false)}
        >
          <p>Your browser doesn’t support this video format.</p>
        </video>
      ) : (
        <EmptyState
          title="A little pause before your next lesson."
          description="This video is unavailable right now. Try again, or choose another lesson from the course outline."
          action="Try the video again"
          onClick={() => {
            setPlaybackFailed(false)
            player.current?.load()
          }}
        />
      )}
      <div className="lesson-heading">
        <h1>{lesson.title}</h1>
        <button
          className={`button ${
            completed ? "button-secondary" : "button-primary"
          }`}
          disabled={loading || completed}
          onClick={complete}
        >
          {completed ? (
            <>
              <FiCheckCircle />
              Lesson complete
            </>
          ) : loading ? (
            "Saving your progress…"
          ) : (
            "Mark as complete"
          )}
        </button>
      </div>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-navigation">
        <button
          className="button button-secondary"
          disabled={index === 0}
          onClick={() => {
            setPlaybackFailed(false)
            navigate(path(lessons[index - 1]))
          }}
        >
          Previous lesson
        </button>
        {index < lessons.length - 1 ? (
          <button
            className="button button-primary"
            onClick={() => {
              setPlaybackFailed(false)
              navigate(path(lessons[index + 1]))
            }}
          >
            Next lesson
          </button>
        ) : (
          <Link
            className="button button-primary"
            to="/dashboard/enrolled-courses"
          >
            Back to my learning
          </Link>
        )}
      </div>
    </div>
  )
}
