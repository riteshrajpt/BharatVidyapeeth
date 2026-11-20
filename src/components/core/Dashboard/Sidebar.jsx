import { useState } from "react"
import { FiBookOpen, FiLogOut } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import Avatar from "../../Common/Avatar"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch(),
    navigate = useNavigate()
  const [confirmation, setConfirmation] = useState(null)
  return (
    <>
      <aside className="dashboard-sidebar">
        <p className="sidebar-label">YOUR LEARNING SPACE</p>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {sidebarLinks
            .filter((link) => !link.type || link.type === user?.accountType)
            .map((link) => (
              <SidebarLink
                key={link.id}
                link={{
                  ...link,
                  name:
                    link.name === "Enrolled Courses"
                      ? "My learning"
                      : link.name === "Cart"
                      ? "Learning bag"
                      : link.name,
                }}
                iconName={link.icon}
              />
            ))}
        </nav>
        <div className="sidebar-divider" />
        <nav
          className="sidebar-nav sidebar-nav-secondary"
          aria-label="Account navigation"
        >
          <SidebarLink
            link={{ name: "Account settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            className="sidebar-link"
            onClick={() =>
              setConfirmation({
                text1: "Taking a little break?",
                text2: "Your learning will be right here when you get back.",
                btn1Text: "Log out",
                btn2Text: "Stay here",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmation(null),
              })
            }
          >
            <FiLogOut />
            Log out
          </button>
        </nav>
        <div className="sidebar-promo">
          <FiBookOpen />
          <h3>Keep that curiosity going.</h3>
          <p>Your next skill could be the start of something great.</p>
          <Link className="text-link" to="/courses">
            Find my next course
          </Link>
        </div>
        <div className="sidebar-user">
          <Avatar user={user} />
          <div>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            <small>{user?.accountType} account</small>
          </div>
        </div>
      </aside>
      {confirmation && <ConfirmationModal modalData={confirmation} />}
    </>
  )
}
