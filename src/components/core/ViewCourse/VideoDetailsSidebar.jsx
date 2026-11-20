import { useEffect, useState } from "react"
import { FiCheckCircle, FiChevronDown, FiPlayCircle } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)
  const [expanded, setExpanded] = useState(sectionId)
  useEffect(() => setExpanded(sectionId), [sectionId])
  const progress = totalNoOfLectures
    ? Math.min(
        100,
        Math.round((completedLectures.length / totalNoOfLectures) * 100)
      )
    : 0
  return (
    <aside className="lesson-sidebar">
      <Link to="/dashboard/enrolled-courses" className="text-link">
        Back to my learning
      </Link>
      <h2>{courseEntireData.courseName}</h2>
      <div className="lesson-progress">
        {completedLectures.length} of {totalNoOfLectures} lessons complete ·{" "}
        {progress}%
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Course progress"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <nav aria-label="Course lessons">
        {courseSectionData.map((section) => (
          <div className="lesson-section" key={section._id}>
            <button
              onClick={() =>
                setExpanded((current) =>
                  current === section._id ? "" : section._id
                )
              }
              aria-expanded={expanded === section._id}
              aria-controls={`lesson-section-${section._id}`}
            >
              <span>{section.sectionName}</span>
              <FiChevronDown
                style={{
                  transform:
                    expanded === section._id ? "rotate(180deg)" : undefined,
                }}
              />
            </button>
            <div
              hidden={expanded !== section._id}
              id={`lesson-section-${section._id}`}
            >
              {section.subSection?.map((lesson) => (
                <Link
                  key={lesson._id}
                  to={`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${lesson._id}`}
                  className={`lesson-link ${
                    subSectionId === lesson._id ? "active" : ""
                  }`}
                  aria-current={
                    subSectionId === lesson._id ? "page" : undefined
                  }
                >
                  {completedLectures.includes(lesson._id) ? (
                    <FiCheckCircle />
                  ) : (
                    <FiPlayCircle />
                  )}
                  <span>{lesson.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <button
        className="button button-secondary button-full mt-6"
        onClick={() => setReviewModal(true)}
      >
        Share your experience
      </button>
    </aside>
  )
}
