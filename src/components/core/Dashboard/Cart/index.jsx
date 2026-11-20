import { FiShoppingBag, FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI"
import { removeFromCart } from "../../../../slices/cartSlice"
import { formatPrice } from "../../../Common/CourseCard"
import { EmptyState, LoadingState } from "../../../Common/PageState"

export default function Cart() {
  const { cart, total, totalItems } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch(),
    navigate = useNavigate()
  if (paymentLoading)
    return <LoadingState message="Getting your enrollment ready…" />
  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">SAVE A LITTLE ROOM FOR POSSIBILITY</span>
          <h1>Your learning bag.</h1>
          <p>
            {totalItems} {totalItems === 1 ? "course" : "courses"} for your next
            chapter.
          </p>
        </div>
        <Link className="button button-secondary" to="/courses">
          Keep exploring
        </Link>
      </header>
      {!cart.length ? (
        <EmptyState
          title="A little empty. A lot of potential."
          description="Save courses you’re curious about, then make your next move when you’re ready."
          action="Find my next skill"
        />
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((course) => (
              <article className="cart-item" key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img src={course.thumbnail} alt="" />
                </Link>
                <div>
                  <p>{course.category?.name || "Self-paced course"}</p>
                  <h2>
                    <Link to={`/courses/${course._id}`}>
                      {course.courseName}
                    </Link>
                  </h2>
                  <p>
                    Learn with {course.instructor?.firstName}{" "}
                    {course.instructor?.lastName}
                  </p>
                </div>
                <div>
                  <strong>{formatPrice(course.price)}</strong>
                  <button
                    aria-label={`Remove ${course.courseName} from your learning bag`}
                    onClick={() => dispatch(removeFromCart(course._id))}
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="surface-card cart-total">
            <span className="eyebrow">YOUR NEXT INVESTMENT IS YOU</span>
            <h2 className="mt-4 text-xl">A fresh set of possibilities.</h2>
            <div className="enrolled-progress">
              <span>
                {totalItems} {totalItems === 1 ? "course" : "courses"}
              </span>
              <span>Total</span>
            </div>
            <strong>{formatPrice(total)}</strong>
            <button
              className="button button-primary button-full"
              onClick={() =>
                BuyCourse(
                  token,
                  cart.map((course) => course._id),
                  user,
                  navigate,
                  dispatch
                )
              }
            >
              <FiShoppingBag />
              Enroll in my courses
            </button>
            <p>Secure checkout with Razorpay.</p>
          </aside>
        </div>
      )}
    </>
  )
}
