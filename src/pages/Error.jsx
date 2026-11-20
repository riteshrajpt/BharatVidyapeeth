import { FiCompass } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function Error() {
  return (
    <section className="auth-card-page">
      <div className="auth-card">
        <span className="state-icon">
          <FiCompass />
        </span>
        <span className="eyebrow">A LITTLE DETOUR · 404</span>
        <h1>
          Even curious minds
          <br />
          take a wrong turn.
        </h1>
        <p>
          This page may have moved, or the link might be incomplete. Your next
          discovery is still out there.
        </p>
        <Link to="/courses" className="button button-primary button-full">
          Explore the course library
        </Link>
        <Link to="/" className="auth-back">
          Take me home
        </Link>
      </div>
    </section>
  )
}
