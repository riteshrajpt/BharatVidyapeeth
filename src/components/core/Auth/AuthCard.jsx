import { Link } from "react-router-dom"

export default function AuthCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  backTo = "/login",
  backLabel = "Back to log in",
}) {
  return (
    <section className="auth-card-page">
      <div className="auth-card">
        <span className="state-icon">
          <Icon aria-hidden="true" />
        </span>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
        <Link className="auth-back" to={backTo}>
          {backLabel}
        </Link>
      </div>
    </section>
  )
}
