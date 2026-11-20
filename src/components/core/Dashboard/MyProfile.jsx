import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { ACCOUNT_TYPE } from "../../../utils/constants"
import Avatar from "../../Common/Avatar"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const details = user?.additionalDetails || {}
  const personal = [
    ["First name", user?.firstName],
    ["Last name", user?.lastName],
    ["Email address", user?.email],
    ["Phone number", details.contactNumber],
    ["Gender", details.gender],
    [
      "Date of birth",
      details.dateOfBirth
        ? new Date(details.dateOfBirth).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : null,
    ],
  ]
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">A LITTLE PROGRESS, EVERY DAY</span>
          <h1>Hello, {user?.firstName || "curious mind"}.</h1>
          <p>Here’s to the next thing you’ll learn, build, or discover.</p>
        </div>
        <Link
          className="button button-primary"
          to={
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
              ? "/dashboard/my-courses"
              : "/dashboard/enrolled-courses"
          }
        >
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
            ? "My courses"
            : "Continue learning"}
        </Link>
      </header>
      <section className="profile-cover">
        <div className="profile-person">
          <Avatar user={user} />
          <div>
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            <p>{user?.email}</p>
            <span className="profile-badge">
              {user?.accountType} · Always learning
            </span>
          </div>
        </div>
        <Link
          to="/dashboard/settings"
          className="button button-secondary button-small"
        >
          Edit my profile
        </Link>
      </section>
      <section className="surface-card">
        <div className="surface-heading">
          <h2>A little about you</h2>
          <Link className="text-link" to="/dashboard/settings">
            Edit
          </Link>
        </div>
        <p>
          {details.about ||
            "Your story is still being written. Add a little about yourself, your interests, or what you’re hoping to learn."}
        </p>
      </section>
      <section className="surface-card">
        <div className="surface-heading">
          <h2>The details that make you, you</h2>
          <Link className="text-link" to="/dashboard/settings">
            Update details
          </Link>
        </div>
        <dl className="profile-details-grid">
          {personal.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "Not added yet"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
