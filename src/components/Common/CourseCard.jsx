import { useState } from "react"
import { FiBookOpen, FiPlayCircle, FiStar, FiUser } from "react-icons/fi"
import { Link } from "react-router-dom"

import GetAvgRating from "../../utils/avgRating"

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
export default function CourseCard({ course, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false)
  const rating = GetAvgRating(course.ratingAndReviews || [])
  return (
    <article className="course-card">
      <Link
        className={`course-art course-art-${index % 3}`}
        to={`/courses/${course._id}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {course.thumbnail && !imageFailed ? (
          <img
            src={course.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <FiBookOpen className="course-fallback-icon" />
        )}
        <span className="course-art-overlay">
          <FiPlayCircle /> Take a closer look
        </span>
        <span className="course-format">
          <FiPlayCircle /> Self-paced
        </span>
      </Link>
      <div className="course-card-content">
        <span className="eyebrow course-category">
          {course.category?.name || "Build your skills"}
        </span>
        <h3>
          <Link to={`/courses/${course._id}`}>{course.courseName}</Link>
        </h3>
        <p className="course-instructor">
          <FiUser />{" "}
          {course.instructor
            ? `${course.instructor.firstName || ""} ${
                course.instructor.lastName || ""
              }`.trim()
            : "BharatVidyapeeth instructor"}
        </p>
        <div className="course-card-meta">
          <span className="rating">
            <FiStar />
            {Number.isFinite(rating) && rating > 0 ? (
              <>
                <strong>{rating}</strong>
                <span>({course.ratingAndReviews?.length} reviews)</span>
              </>
            ) : (
              <span>New to your learning journey</span>
            )}
          </span>
        </div>
        <div className="course-card-bottom">
          <strong>{formatPrice(course.price)}</strong>
          <Link to={`/courses/${course._id}`} className="text-link">
            View course
          </Link>
        </div>
      </div>
    </article>
  )
}
