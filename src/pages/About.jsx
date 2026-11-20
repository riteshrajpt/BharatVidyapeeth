import { FiBookOpen, FiCompass, FiHeart } from "react-icons/fi"
import { Link } from "react-router-dom"

import story from "../assets/Images/FoundingStory.png"
import imageOne from "../assets/Images/aboutus1.webp"
import imageTwo from "../assets/Images/aboutus2.webp"
import imageThree from "../assets/Images/aboutus3.webp"
import Footer from "../components/Common/Footer"

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <span className="eyebrow">A LITTLE ABOUT OUR WHY</span>
          <h1>
            A brighter future starts
            <br />
            with <span className="text-green">a curious mind.</span>
          </h1>
          <p>
            We believe learning should open doors, spark ideas, and help you see
            what’s possible. BharatVidyapeeth is a space to take that next step,
            wherever you’re starting from.
          </p>
          <div className="about-gallery">
            <img
              src={imageOne}
              alt="Students sharing ideas in a learning space"
            />
            <img src={imageTwo} alt="A moment of focus and discovery" />
            <img
              src={imageThree}
              alt="Learners exploring something new together"
            />
          </div>
        </div>
      </section>
      <section className="section-pad story-grid container">
        <img
          src={story}
          alt="The people and ideas behind our learning community"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">OUR STORY</span>
          <h2>
            Good education
            <br />
            should go <span className="text-green">beyond walls.</span>
          </h2>
          <p>
            Our story starts with a simple idea: the opportunity to learn
            shouldn’t depend on where you live or what your schedule looks like.
          </p>
          <p>
            We’re bringing educators and curious minds together in one place.
            With practical courses, room to practice, and a pace you can make
            your own, we want learning to feel like a possibility, not another
            barrier.
          </p>
          <Link to="/courses" className="button button-primary">
            Find your next skill
          </Link>
        </div>
      </section>
      <section className="how-section section-pad">
        <div className="container">
          <div className="section-header centered">
            <span className="eyebrow">WHAT WE BELIEVE</span>
            <h2>
              Built around you.
              <br />
              Made for what’s next.
            </h2>
          </div>
          <div className="values-grid">
            {[
              [
                FiCompass,
                "Curiosity comes first",
                "A good question can change your direction. We make space for exploration, discovery, and finding what excites you.",
              ],
              [
                FiBookOpen,
                "Knowledge is for sharing",
                "The best teachers bring more than answers. They bring their experience, a fresh perspective, and a way to make things click.",
              ],
              [
                FiHeart,
                "Progress is personal",
                "Your journey won’t look like anyone else’s. Learn at your own pace, celebrate the small steps, and keep moving forward.",
              ],
            ].map(([Icon, title, text]) => (
              <article key={title} className="value-card">
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad container">
        <div className="catalog-help">
          <span className="note-icon">
            <FiHeart />
          </span>
          <div>
            <h2>Bring your curiosity. We’ll meet you there.</h2>
            <p>Explore your next skill or help someone discover theirs.</p>
          </div>
          <Link to="/signup" className="button button-primary">
            Find your place
          </Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
