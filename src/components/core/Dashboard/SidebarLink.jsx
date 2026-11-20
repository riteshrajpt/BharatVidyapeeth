import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName] || Icons.VscCircle
  const dispatch = useDispatch()
  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
    >
      <Icon />
      <span>{link.name}</span>
    </NavLink>
  )
}
