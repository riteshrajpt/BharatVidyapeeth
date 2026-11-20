import { FiBookOpen, FiMail, FiMessageCircle } from "react-icons/fi"
import { Link } from "react-router-dom"

import Footer from "../components/Common/Footer"
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm"

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Get in touch</span>
          </div>
          <span className="eyebrow">GOOD CONVERSATIONS START HERE</span>
          <h1>
            A question? An idea?
            <br />
            <span className="text-green">We’re all ears.</span>
          </h1>
          <p>
            Whether you’re choosing your first course, finding your way around,
            or ready to teach, let’s work it out together.
          </p>
          <span className="page-hero-icon" aria-hidden="true">
            <FiMessageCircle />
          </span>
        </div>
      </section>
      <section className="section-pad contact-grid container">
        <div className="contact-copy">
          <span className="eyebrow">LET’S MAKE IT A LITTLE EASIER</span>
          <h2>
            People helping
            <br />
            people move forward.
          </h2>
          <p>
            Tell us what’s on your mind and include any details that will help
            us understand your question. We’ll do our best to point you in the
            right direction.
          </p>
          <div className="contact-method">
            <span className="note-icon">
              <FiMail />
            </span>
            <div>
              <h3>Drop us a line</h3>
              <a href="mailto:bharatbhavanainnovations@gmail.com">
                bharatbhavanainnovations@gmail.com
              </a>
            </div>
          </div>
          <div className="contact-method">
            <span className="note-icon">
              <FiBookOpen />
            </span>
            <div>
              <h3>Looking for your next skill?</h3>
              <p>The course library is a great place to start.</p>
              <Link to="/courses" className="text-link">
                Explore the courses
              </Link>
            </div>
          </div>
        </div>
        <div className="contact-form-card">
          <h2>Let’s hear it.</h2>
          <p>A few details, and we’ll take it from there.</p>
          <ContactUsForm />
        </div>
      </section>
      <Footer />
    </>
  )
}
