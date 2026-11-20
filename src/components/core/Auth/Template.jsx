import { FiCheckCircle } from "react-icons/fi"
import { Link } from "react-router-dom"

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

export default function Template({ image, formType }) {
  const signup = formType === "signup"
  return (
    <section className="auth-layout">
      <div className="auth-main">
        <span className="eyebrow">
          {signup
            ? "A FRESH START, A NEW SKILL"
            : "YOUR NEXT CHAPTER IS WAITING"}
        </span>
        <h1>
          {signup
            ? "A little curiosity. Endless possibilities."
            : "Good to have you back."}
        </h1>
        <p className="auth-description">
          {signup
            ? "Create your account and take the first step toward something you’ve always wanted to learn."
            : "Pick up where you left off. Your next breakthrough might be one lesson away."}
        </p>
        {signup ? <SignupForm /> : <LoginForm />}
        <p className="auth-footnote">
          {signup ? "Already part of the community?" : "New around here?"}{" "}
          <Link to={signup ? "/login" : "/signup"}>
            {signup ? "Log in" : "Start your journey"}
          </Link>
        </p>
      </div>
      <aside className="auth-art">
        <div>
          <span className="eyebrow">A LITTLE LEARNING. A BIGGER FUTURE.</span>
          <h2>
            Every expert
            <br />
            was once
            <br />a beginner.
          </h2>
          <p>
            You bring the curiosity. We’ll help you find the confidence to keep
            going.
          </p>
        </div>
        <img src={image} alt="A learner enjoying a moment of discovery" />
        <div className="auth-art-note">
          <FiCheckCircle /> Your pace. Your goals. Your next chapter.
        </div>
      </aside>
    </section>
  )
}
