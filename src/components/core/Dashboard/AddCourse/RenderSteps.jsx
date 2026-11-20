import { FiCheck } from "react-icons/fi"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)
  return (
    <>
      <ol className="course-steps" aria-label="Course creation progress">
        {["Course details", "Add lessons", "Publish"].map((title, index) => (
          <li
            key={title}
            className={step >= index + 1 ? "reached" : ""}
            aria-current={step === index + 1 ? "step" : undefined}
          >
            <span>{step > index + 1 ? <FiCheck /> : index + 1}</span>
            <strong>{title}</strong>
          </li>
        ))}
      </ol>
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  )
}
