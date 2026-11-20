import { useEffect, useRef, useState } from "react"
import { FiChevronDown, FiGrid, FiLogOut, FiSettings } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"
import Avatar from "../../Common/Avatar"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [])
  if (!user) return null
  return (
    <div className="profile-menu" ref={ref}>
      <button
        className="profile-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="profile-navigation"
        aria-label="Your account menu"
      >
        <Avatar user={user} />
        <FiChevronDown size={13} />
      </button>
      {open && (
        <div className="profile-menu-panel" id="profile-navigation">
          <div className="profile-menu-heading">
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            <small>{user.email}</small>
          </div>
          <Link to="/dashboard/my-profile">
            <FiGrid />
            Your learning space
          </Link>
          <Link to="/dashboard/settings">
            <FiSettings />
            Account settings
          </Link>
          <button
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
          >
            <FiLogOut />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
