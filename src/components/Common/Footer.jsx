import { FiHeart } from "react-icons/fi"
import { Link } from "react-router-dom"

import Brand from "./Brand"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>
              For the curious. The ambitious. The ones who never stop learning.
            </p>
            <span className="footer-note">
              <FiHeart aria-hidden="true" /> Made for a brighter tomorrow.
            </span>
          </div>
          <div>
            <h3>Find your next skill</h3>
            <Link to="/courses">All courses</Link>
            <Link to="/catalog/web-development">Web development</Link>
            <Link to="/catalog/al-&-ml">AI & machine learning</Link>
          </div>
          <div>
            <h3>Your learning space</h3>
            <Link to="/dashboard">My learning</Link>
            <Link to="/signup?role=instructor">Become an instructor</Link>
            <Link to="/login">Log in to your account</Link>
          </div>
          <div>
            <h3>A little about us</h3>
            <Link to="/about">Our story</Link>
            <Link to="/contact">Contact & support</Link>
            <Link to="/forgot-password">Account recovery</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} BharatVidyapeeth. All rights reserved.
          </span>
          <span>Keep your curiosity alive.</span>
        </div>
      </div>
    </footer>
  )
}
