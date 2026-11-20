import { FiChevronDown, FiPlayCircle } from "react-icons/fi"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const expanded = isActive.includes(course._id)
  const id = `curriculum-${course._id}`
  return (
    <div className="curriculum-section">
      <button
        className="curriculum-trigger"
        onClick={() => handleActive(course._id)}
        aria-expanded={expanded}
        aria-controls={id}
      >
        <span>
          <FiChevronDown
            style={{ transform: expanded ? "rotate(180deg)" : undefined }}
          />
          {course.sectionName}
        </span>
        <small>{course.subSection?.length || 0} lessons</small>
      </button>
      <div id={id} hidden={!expanded} className="curriculum-lessons">
        {course.subSection?.map((lesson) => (
          <div className="curriculum-lesson" key={lesson._id}>
            <span>
              <FiPlayCircle />
              {lesson.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
