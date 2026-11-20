import { FiBookOpen } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function Brand({ inverse = false }) {
  return (
    <Link
      to="/"
      className={`brand ${inverse ? "brand-inverse" : ""}`}
      aria-label="BharatVidyapeeth home"
    >
      <span className="brand-symbol">
        <FiBookOpen aria-hidden="true" />
      </span>
      <span>
        Bharat<span className="brand-accent">Vidyapeeth</span>
        <small>A little learning. A bigger future.</small>
      </span>
    </Link>
  )
}
