import { useState } from "react"

export default function Avatar({ user }) {
  const [failed, setFailed] = useState(false)
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  return user?.image && !failed ? (
    <img
      className="avatar"
      src={user.image}
      alt={name || "Your profile"}
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="avatar" aria-label={name || "Your profile"}>
      {(user?.firstName?.[0] || "B") + (user?.lastName?.[0] || "V")}
    </span>
  )
}
