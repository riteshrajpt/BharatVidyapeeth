import "@testing-library/jest-dom"
import { configureStore } from "@reduxjs/toolkit"
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"

import ConfirmationModal from "./components/Common/ConfirmationModal"
import Navbar from "./components/Common/Navbar"
import PasswordField from "./components/core/Auth/PasswordField"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Sidebar from "./components/core/Dashboard/Sidebar"
import useCourseCatalog from "./hooks/useCourseCatalog"
import CourseDetails from "./pages/CourseDetails"
import Courses from "./pages/Courses"
import { apiConnector } from "./services/apiConnector"
import { login } from "./services/operations/authAPI"
import { getUserEnrolledCourses } from "./services/operations/profileAPI"

jest.mock("./hooks/useCourseCatalog", () => ({
  __esModule: true,
  default: jest.fn(),
  categorySlug: (name = "") => name.trim().toLowerCase().replace(/\s+/g, "-"),
}))
jest.mock("./services/operations/profileAPI", () => ({
  getUserEnrolledCourses: jest.fn(),
}))
jest.mock("./services/apiConnector", () => ({ apiConnector: jest.fn() }))
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}))

const courses = [
  {
    _id: "course-ai",
    courseName: "Practical AI",
    price: 200,
    createdAt: "2026-11-18",
    category: { _id: "ai", name: "AI" },
    instructor: { firstName: "Asha", lastName: "Rao" },
    ratingAndReviews: [],
  },
  {
    _id: "course-web",
    courseName: "Web Foundations",
    price: 100,
    createdAt: "2026-11-17",
    category: { _id: "web", name: "Web Development" },
    ratingAndReviews: [],
  },
]
const categories = [
  { _id: "ai", name: "AI", courses: ["course-ai"] },
  { _id: "web", name: "Web Development", courses: ["course-web"] },
]

function renderPage(ui, { path = "/", user = null } = {}) {
  const state = {
    auth: { token: user ? "local-test-session" : null, loading: false },
    profile: { user, loading: false },
    cart: { totalItems: 0, cart: [], total: 0 },
    course: { paymentLoading: false },
  }
  const store = configureStore({ reducer: (current = state) => current })
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </Provider>
  )
}
function Location() {
  const location = useLocation()
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  )
}
function CatalogRoutes() {
  return (
    <>
      <Routes>
        <Route path="/courses" element={<Courses />} />
        <Route path="/catalog/:catalogName" element={<Courses />} />
      </Routes>
      <Location />
    </>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  useCourseCatalog.mockReturnValue({
    courses,
    categories,
    loading: false,
    error: false,
    retry: jest.fn(),
  })
})

test("mobile navigation opens, exposes real links, and closes with Escape", () => {
  renderPage(<Navbar />)
  const toggle = screen.getByRole("button", { name: "Open navigation" })
  fireEvent.click(toggle)
  const navigation = screen.getByRole("navigation", {
    name: "Mobile navigation",
  })
  expect(
    within(navigation).getByRole("link", { name: "Explore courses" })
  ).toHaveAttribute("href", "/courses")
  expect(toggle).toHaveAttribute("aria-expanded", "true")
  fireEvent.keyDown(document, { key: "Escape" })
  expect(
    screen.queryByRole("navigation", { name: "Mobile navigation" })
  ).not.toBeInTheDocument()
})

test("course search filters real data and keeps the query in the URL", () => {
  renderPage(<CatalogRoutes />, { path: "/courses" })
  fireEvent.change(
    screen.getByRole("searchbox", { name: "Search the course library" }),
    { target: { value: "Practical" } }
  )
  expect(
    screen.getByRole("heading", { name: "Practical AI" })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("heading", { name: "Web Foundations" })
  ).not.toBeInTheDocument()
  expect(screen.getByTestId("location")).toHaveTextContent("q=Practical")
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }))
  expect(screen.getAllByRole("article")).toHaveLength(2)
})

test("course sorting changes displayed order", () => {
  renderPage(<CatalogRoutes />, { path: "/courses" })
  fireEvent.change(screen.getByRole("combobox", { name: "Sort courses" }), {
    target: { value: "price-low" },
  })
  expect(
    within(screen.getAllByRole("article")[0]).getByRole("heading", {
      name: "Web Foundations",
    })
  ).toBeInTheDocument()
  expect(screen.getByTestId("location")).toHaveTextContent("sort=price-low")
})

test("category pages filter by the selected category", () => {
  renderPage(<CatalogRoutes />, { path: "/catalog/web-development" })
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Web Development"
  )
  expect(screen.getAllByRole("article")).toHaveLength(1)
  expect(
    screen.getByRole("heading", { name: "Web Foundations" })
  ).toBeInTheDocument()
})

test("empty course search offers a way back to the full library", () => {
  renderPage(<CatalogRoutes />, { path: "/courses?q=not-a-real-topic" })
  expect(
    screen.getByRole("heading", {
      name: "A different search could be your spark",
    })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("link", { name: "Explore all courses" })
  ).toHaveAttribute("href", "/courses")
})

test("catalog failures expose a working retry instead of an endless spinner", () => {
  const retry = jest.fn()
  useCourseCatalog.mockReturnValue({
    courses: [],
    categories: [],
    loading: false,
    error: true,
    retry,
  })
  renderPage(<CatalogRoutes />, { path: "/courses" })
  expect(screen.getByRole("alert")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "Try again" }))
  expect(retry).toHaveBeenCalledTimes(1)
})

test("invalid course links show an error and recovery navigation", async () => {
  renderPage(
    <Routes>
      <Route path="/courses/:courseId" element={<CourseDetails />} />
    </Routes>,
    { path: "/courses/invalid-id" }
  )
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "This course is unavailable"
  )
  expect(
    screen.getByRole("link", { name: "Back to all courses" })
  ).toHaveAttribute("href", "/courses")
  expect(screen.queryByRole("status")).not.toBeInTheDocument()
})

test("password visibility is keyboard-accessible and does not submit the form", () => {
  const submit = jest.fn((event) => event.preventDefault())
  render(
    <form onSubmit={submit}>
      <PasswordField value="test-password" onChange={() => {}} />
    </form>
  )
  const input = screen.getByLabelText("Password", { exact: true })
  expect(input).toHaveAttribute("type", "password")
  fireEvent.click(screen.getByRole("button", { name: "Show password" }))
  expect(input).toHaveAttribute("type", "text")
  expect(submit).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: "Hide password" }))
  expect(input).toHaveAttribute("type", "password")
})

test("enrolled course without lessons never generates an undefined lesson URL", async () => {
  getUserEnrolledCourses.mockResolvedValue([
    { ...courses[0], courseContent: [], status: "Published" },
  ])
  renderPage(<EnrolledCourses />, {
    user: { firstName: "Learner", accountType: "Student" },
  })
  expect(
    await screen.findByRole("link", { name: "View course details" })
  ).toHaveAttribute("href", "/courses/course-ai")
  expect(
    screen.queryByRole("link", { name: "Start my first lesson" })
  ).not.toBeInTheDocument()
})

test("the learner dashboard hides instructor-only controls", () => {
  renderPage(<Sidebar />, {
    user: { firstName: "Learner", lastName: "Example", accountType: "Student" },
  })
  const nav = screen.getByRole("navigation", { name: "Dashboard navigation" })
  expect(
    within(nav).getByRole("link", { name: "My learning" })
  ).toBeInTheDocument()
  expect(
    within(nav).queryByRole("link", { name: "Add Course" })
  ).not.toBeInTheDocument()
})

test("failed enrollment loading shows a retry instead of claiming the account has no courses", async () => {
  getUserEnrolledCourses.mockResolvedValue(null)
  renderPage(<EnrolledCourses />, {
    user: { firstName: "Learner", accountType: "Student" },
  })
  expect(await screen.findByRole("alert")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
  expect(
    screen.queryByRole("link", { name: "Find my first course" })
  ).not.toBeInTheDocument()
})

test("confirmation dialogs trap focus and close on Escape", async () => {
  const cancel = jest.fn()
  renderPage(
    <ConfirmationModal
      modalData={{
        text1: "Keep exploring?",
        text2: "Your course is saved.",
        btn1Text: "Continue",
        btn2Text: "Cancel",
        btn1Handler: jest.fn(),
        btn2Handler: cancel,
      }}
    />
  )
  const first = screen.getByRole("button", { name: "Continue" })
  const last = screen.getByRole("button", { name: "Cancel" })
  await waitFor(() => expect(first).toHaveFocus())
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true })
  expect(last).toHaveFocus()
  fireEvent.keyDown(document, { key: "Escape" })
  expect(cancel).toHaveBeenCalledTimes(1)
})

test("login returns a learner to their requested local page", async () => {
  apiConnector.mockResolvedValue({
    data: {
      success: true,
      token: "fictional-session",
      user: {
        firstName: "Learner",
        lastName: "Example",
        image: "/fixture-avatar.png",
      },
    },
  })
  const navigate = jest.fn()
  await login(
    "learner@example.com",
    "fictional-password",
    navigate,
    "/dashboard/cart"
  )(jest.fn())
  expect(navigate).toHaveBeenCalledWith("/dashboard/cart")
  localStorage.clear()
})

test("login never follows a protocol-relative external return URL", async () => {
  apiConnector.mockResolvedValue({
    data: {
      success: true,
      token: "fictional-session",
      user: {
        firstName: "Learner",
        lastName: "Example",
        image: "/fixture-avatar.png",
      },
    },
  })
  const navigate = jest.fn()
  await login(
    "learner@example.com",
    "fictional-password",
    navigate,
    "//outside.example/"
  )(jest.fn())
  expect(navigate).toHaveBeenCalledWith("/dashboard/my-profile")
  localStorage.clear()
})

test("protected pages send guests to login instead of exposing the workspace", () => {
  renderPage(
    <>
      <Routes>
        <Route
          path="/dashboard/cart"
          element={
            <PrivateRoute>
              <h1>Private workspace</h1>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<h1>Account login</h1>} />
      </Routes>
      <Location />
    </>,
    { path: "/dashboard/cart" }
  )
  expect(
    screen.getByRole("heading", { name: "Account login" })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("heading", { name: "Private workspace" })
  ).not.toBeInTheDocument()
  expect(screen.getByTestId("location")).toHaveTextContent("/login")
})
