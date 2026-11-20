import { FiBookOpen, FiRefreshCw } from "react-icons/fi"
import { Link } from "react-router-dom"

export function LoadingState({ message = "Getting things ready…" }) {
  return (
    <div className="page-state" role="status">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  )
}
export function EmptyState({
  title = "Your next chapter is waiting",
  description,
  action,
  to = "/courses",
  onClick,
}) {
  return (
    <div className="empty-state">
      <span className="state-icon">
        <FiBookOpen aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action &&
        (onClick ? (
          <button className="button button-primary" onClick={onClick}>
            {action}
          </button>
        ) : (
          <Link className="button button-primary" to={to}>
            {action}
          </Link>
        ))}
    </div>
  )
}
export function ErrorState({
  retry,
  message = "We couldn’t load this page. Please try again.",
}) {
  return (
    <div className="page-state" role="alert">
      <span className="state-icon">
        <FiRefreshCw />
      </span>
      <h2>A small pause in your learning journey</h2>
      <p>{message}</p>
      {retry && (
        <button className="button button-primary" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  )
}
