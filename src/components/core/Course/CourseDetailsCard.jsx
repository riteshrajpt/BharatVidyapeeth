import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { FiCheck, FiShare2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { formatPrice } from "../../Common/CourseCard"

export default function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const enrolled =
    !!user &&
    course.studentsEnroled?.some(
      (id) => String(id?._id || id) === String(user._id)
    )
  const add = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
      return toast.error("Instructor accounts cannot purchase courses.")
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "Save a little space for your next skill.",
      text2: "Log in to add this course to your learning bag.",
      btn1Text: "Log in",
      btn2Text: "Keep exploring",
      btn1Handler: () =>
        navigate("/login", { state: { from: `/courses/${course._id}` } }),
      btn2Handler: () => setConfirmationModal(null),
    })
  }
  return (
    <aside className="purchase-card" aria-label="Course enrollment">
      <img src={course.thumbnail} alt={course.courseName} />
      <div className="purchase-content">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <strong className="purchase-price">{formatPrice(course.price)}</strong>
        <p className="purchase-price-note">
          One purchase. Learn at your own pace.
        </p>
        <div className="purchase-buttons">
          <button
            className="button button-primary"
            onClick={
              enrolled
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {enrolled ? "Continue my learning" : "Start learning this skill"}
          </button>
          {!enrolled && (
            <button className="button button-secondary" onClick={add}>
              Add to learning bag
            </button>
          )}
        </div>
        <div className="purchase-includes">
          <h3>A little more about your course</h3>
          <p>
            <FiCheck /> Self-paced video lessons
          </p>
          <p>
            <FiCheck /> Progress saved in your learning space
          </p>
          {course.instructions?.map((item, index) => (
            <p key={index}>
              <FiCheck /> {item}
            </p>
          ))}
        </div>
        <button
          className="share-course"
          onClick={() => {
            const ok = copy(window.location.href)
            ok
              ? toast.success("Course link copied")
              : toast.error("Unable to copy the link")
          }}
        >
          <FiShare2 /> Share this discovery
        </button>
      </div>
    </aside>
  )
}
