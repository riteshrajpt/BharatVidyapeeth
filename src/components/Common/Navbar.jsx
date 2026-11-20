import { useEffect, useState } from "react"
import { FiMenu, FiSearch, FiShoppingBag, FiX } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"

import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import Brand from "./Brand"

export default function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onEscape)
    return () => document.removeEventListener("keydown", onEscape)
  }, [])
  const search = (event) => {
    event.preventDefault()
    navigate(
      `/courses${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`
    )
  }
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="nav-bar container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/catalog")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Explore courses
          </NavLink>
          <NavLink to="/about" className="nav-link">
            Our story
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Get in touch
          </NavLink>
        </nav>
        <div className="nav-actions">
          <form className="nav-search" role="search" onSubmit={search}>
            <FiSearch aria-hidden="true" />
            <input
              aria-label="Search courses"
          placeholder="Find your next skill"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          {token ? (
            <>
              {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <Link
                  className="icon-button cart-link"
                  to="/dashboard/cart"
                  aria-label={`Shopping bag, ${totalItems} courses`}
                >
                  <FiShoppingBag />
                  {totalItems > 0 && <span>{totalItems}</span>}
                </Link>
              )}
              <ProfileDropdown />
            </>
          ) : (
            <div className="desktop-auth">
              <Link to="/login" className="login-link">
                Log in
              </Link>
              <Link to="/signup" className="button button-primary button-small">
                Start learning
              </Link>
            </div>
          )}
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="mobile-nav container"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <form className="mobile-search" role="search" onSubmit={search}>
            <FiSearch />
            <input
              aria-label="Search courses on mobile"
              placeholder="What do you want to learn?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <NavLink to="/courses">Explore courses</NavLink>
          <NavLink to="/about">Our story</NavLink>
          <NavLink to="/contact">Get in touch</NavLink>
          {!token && (
            <div className="mobile-auth">
              <Link to="/login" className="button button-secondary">
                Log in
              </Link>
              <Link to="/signup" className="button button-primary">
                Start learning
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
