import { useState } from "react"
import {
  FiAward,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiCode,
  FiCompass,
  FiLayers,
  FiPlay,
  FiSearch,
  FiZap,
} from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"

import instructorImage from "../assets/Images/Instructor.png"
import heroImage from "../assets/Images/TimelineImage.png"
import CourseCard from "../components/Common/CourseCard"
import Footer from "../components/Common/Footer"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/Common/PageState"
import useCourseCatalog from "../hooks/useCourseCatalog"

const questions = [
  [
    "Where should I start?",
    "Start with a topic you’re curious about. Explore the course library, read what each course covers, and choose a skill that fits your next goal.",
  ],
  [
    "Can I learn at my own pace?",
    "Yes. Courses are made up of recorded lessons, so you can work through the material when it fits your schedule and revisit lessons as you learn.",
  ],
  [
    "How do I access a course after enrolling?",
    "Log in and open My learning from your dashboard. Your enrolled courses, lessons, and learning progress are all in one place.",
  ],
  [
    "Can I share my knowledge as an instructor?",
    "Absolutely. Choose Instructor when you create your account. You can create courses, organize lessons, upload material, and manage your teaching from your dashboard.",
  ],
]
export default function Home() {
  const { courses, categories, loading, error, retry } = useCourseCatalog()
  const [selected, setSelected] = useState("all")
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const activeCategories = categories.filter((category) =>
    courses.some((course) => course.category?._id === category._id)
  )
  const featured = courses
    .filter((course) => selected === "all" || course.category?._id === selected)
    .slice(0, 3)
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid container">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-rule" /> A NEW CHAPTER STARTS HERE
            </span>
            <h1>
              Big ambitions.
              <br />
              Meet your
              <br />
              <span className="hero-highlight">next skill.</span>
              <span className="hero-asterisk" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Turn “I wish I could” into “look what I made.” Learn practical
              skills, follow your curiosity, and build a future that feels like
              you.
            </p>
            <form
              className="hero-search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                navigate(
                  `/courses${
                    query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""
                  }`
                )
              }}
            >
              <FiSearch aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What do you want to learn?"
                aria-label="What do you want to learn?"
              />
              <button className="button button-primary" type="submit">
                Find my course
              </button>
            </form>
            <div className="hero-topics">
              <span>A little inspiration:</span>
              <Link to="/catalog/web-development">Web development</Link>
              <Link to="/catalog/al-&-ml">AI & ML</Link>
            </div>
            <div className="hero-assurance">
              <span>
                <FiCheck /> Learn at your pace
              </span>
              <span>
                <FiCheck /> Build practical skills
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <img
                src={heroImage}
                alt="A learner building new skills at her home workspace"
                fetchPriority="high"
              />
              <div className="hero-photo-caption">
                <span className="play-bubble">
                  <FiPlay />
                </span>
                <div>
                  <span>A little progress, every day.</span>
                  <strong>Your future is a work in progress.</strong>
                </div>
              </div>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon">
                <FiZap />
              </span>
              <div>
                <strong>That “aha!” feeling.</strong>
                <small>There’s a course for that.</small>
              </div>
            </div>
            <div className="floating-note note-bottom">
              <span className="note-icon orange">
                <FiCode />
              </span>
              <div>
                <small>FROM CURIOUS TO CAPABLE</small>
                <strong>One skill at a time.</strong>
              </div>
              <span className="note-check">
                <FiCheck />
              </span>
            </div>
            <span className="hero-orbit" aria-hidden="true" />
            <span className="hero-spark" aria-hidden="true">
              ✧
            </span>
          </div>
        </div>
      </section>
      <section className="benefits-strip">
        <div className="benefits-grid container">
          {[
            [
              FiCompass,
              "A direction, not just a course",
              "Learn with a goal in mind.",
            ],
            [FiClock, "Your time. Your pace.", "Make learning fit your life."],
            [
              FiLayers,
              "Less theory. More doing.",
              "Build skills you can put to work.",
            ],
          ].map(([Icon, title, description]) => (
            <div className="benefit" key={title}>
              <span>
                <Icon />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad container" id="discover">
        <div className="section-header">
          <div>
            <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
            <h2>
              Find your next <span className="text-green">“I made that.”</span>
            </h2>
            <p>A fresh skill. A new perspective. A place to begin.</p>
          </div>
          <Link className="button button-secondary" to="/courses">
            Explore all courses
          </Link>
        </div>
        <div className="filter-tabs" aria-label="Featured course categories">
          <button
            className={selected === "all" ? "selected" : ""}
            onClick={() => setSelected("all")}
          >
            All courses
          </button>
          {activeCategories.map((category) => (
            <button
              key={category._id}
              className={selected === category._id ? "selected" : ""}
              onClick={() => setSelected(category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {loading ? (
          <LoadingState message="Finding your next skill…" />
        ) : error ? (
          <ErrorState retry={retry} />
        ) : (
          <div className="home-course-grid">
            {featured.map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} />
            ))}
            <div className="teaching-card">
              <span className="teaching-icon">
                <FiBookOpen />
              </span>
              <span className="eyebrow">KNOW SOMETHING WORTH SHARING?</span>
              <h3>
                Your experience.
                <br />
                Someone’s
                <br />
                breakthrough.
              </h3>
              <p>
                Help the next curious mind find their way. Become an instructor.
              </p>
              <Link
                className="button button-secondary"
                to="/signup?role=instructor"
              >
                Share your knowledge
              </Link>
            </div>
          </div>
        )}
        {!loading && !error && !courses.length && (
          <EmptyState
            title="New possibilities are on their way"
            description="Our instructors are preparing new courses. Check back soon."
          />
        )}
      </section>
      <section className="how-section section-pad">
        <div className="container">
          <div className="section-header centered">
            <span className="eyebrow">LEARNING THAT MOVES YOU FORWARD</span>
            <h2>
              Small steps.
              <br />
              Real possibilities.
            </h2>
            <p>
              You don’t need to have it all figured out. Just take the next
              step.
            </p>
          </div>
          <div className="steps-grid">
            {[
              [
                FiSearch,
                "Find your spark",
                "Explore topics that excite you. Choose a course that meets you where you are.",
                "mint",
              ],
              [
                FiPlay,
                "Make it your own",
                "Press play, pause, practice, repeat. Learn at a pace that works for your life.",
                "peach",
              ],
              [
                FiAward,
                "See how far you go",
                "Track your progress, grow your confidence, and put your new skills to work.",
                "lavender",
              ],
            ].map(([Icon, title, description, color]) => (
              <article className="step-card" key={title}>
                <span className={`step-icon ${color}`}>
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad container">
        <div className="instructor-banner">
          <div className="instructor-banner-image">
            <img
              src={instructorImage}
              alt="An instructor ready to share his knowledge"
              loading="lazy"
            />
          </div>
          <div className="instructor-banner-copy">
            <span className="eyebrow">
              GOOD KNOWLEDGE DESERVES TO BE SHARED
            </span>
            <h2>
              Someone out there
              <br />
              needs what you know.
            </h2>
            <p>
              Bring your experience, your perspective, your way of explaining
              things. We’ll give you the space to teach.
            </p>
            <Link to="/signup?role=instructor" className="button button-light">
              Become an instructor
            </Link>
          </div>
          <span className="banner-spark" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      <section className="faq-section section-pad container">
        <div>
          <span className="eyebrow">A LITTLE CLARITY</span>
          <h2>
            Curious about
            <br />
            the details?
          </h2>
          <p>Good questions are where learning starts.</p>
          <Link to="/contact" className="text-link">
            Let’s talk
          </Link>
        </div>
        <div className="faq-list">
          {questions.map(([question, answer], index) => (
            <details key={question} open={index === 0 ? true : undefined}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}
