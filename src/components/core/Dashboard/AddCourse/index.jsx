import { FiBookOpen } from "react-icons/fi"

import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">MAKE ROOM FOR SOMEONE’S NEXT SKILL</span>
          <h1>Great knowledge starts with you.</h1>
          <p>
            Give your experience a home. Build your course one step at a time.
          </p>
        </div>
      </header>
      <div className="course-authoring-layout">
        <div>
          <RenderSteps />
        </div>
        <aside className="surface-card authoring-tips">
          <span className="note-icon">
            <FiBookOpen />
          </span>
          <h2>A little guidance goes a long way.</h2>
          <ul>
            <li>
              Choose a clear title that tells learners what they’ll be able to
              do.
            </li>
            <li>
              List practical outcomes and any knowledge they’ll need before
              starting.
            </li>
            <li>Use a landscape thumbnail. A 16:9 image works well.</li>
            <li>Break your course into focused sections and video lessons.</li>
            <li>
              Save your work as a draft while you build. Publish when you’re
              ready.
            </li>
          </ul>
        </aside>
      </div>
    </>
  )
}
