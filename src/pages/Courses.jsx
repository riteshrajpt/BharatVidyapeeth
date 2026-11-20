import { useMemo } from "react"
import { FiBookOpen, FiSearch, FiSliders, FiX } from "react-icons/fi"
import { Link, useParams, useSearchParams } from "react-router-dom"

import CourseCard from "../components/Common/CourseCard"
import Footer from "../components/Common/Footer"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/Common/PageState"
import useCourseCatalog, { categorySlug } from "../hooks/useCourseCatalog"

export default function Courses() {
  const { courses, categories, loading, error, retry } = useCourseCatalog()
  const { catalogName } = useParams()
  const [params, setParams] = useSearchParams()
  const search = params.get("q") || ""
  const selected = catalogName || params.get("category") || "all"
  const sort = params.get("sort") || "recent"
  const category = categories.find(
    (item) => categorySlug(item.name) === selected
  )
  const update = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }
  const filtered = useMemo(
    () =>
      courses
        .filter(
          (course) =>
            (selected === "all" ||
              categorySlug(course.category?.name) === selected) &&
            `${course.courseName} ${course.courseDescription || ""} ${
              course.category?.name || ""
            } ${course.instructor?.firstName || ""}`
              .toLowerCase()
              .includes(search.toLowerCase())
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
            ? b.price - a.price
            : sort === "name"
            ? a.courseName.localeCompare(b.courseName)
            : new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ),
    [courses, selected, search, sort]
  )
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Explore courses</span>
            {category && (
              <>
                <span>/</span>
                <span>{category.name}</span>
              </>
            )}
          </div>
          <span className="eyebrow">A WORLD OF POSSIBILITIES</span>
          <h1>
            {category ? (
              category.name
            ) : (
              <>
                What’s your <span className="text-green">next chapter?</span>
              </>
            )}
          </h1>
          <p>
            {category?.description ||
              "Big ideas start with a little curiosity. Find a course and make your next move."}
          </p>
          <span className="page-hero-icon" aria-hidden="true">
            <FiBookOpen />
          </span>
        </div>
      </section>
      <section className="section-pad catalog-section container">
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <FiSearch />
            <input
              type="search"
              aria-label="Search the course library"
              placeholder="Search courses, topics, or instructors"
              value={search}
              onChange={(event) => update("q", event.target.value)}
            />
            {search && (
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => update("q", "")}
              >
                <FiX />
              </button>
            )}
          </label>
          <label className="catalog-sort">
            <FiSliders />
            <span>Sort by</span>
            <select
              aria-label="Sort courses"
              value={sort}
              onChange={(event) => update("sort", event.target.value)}
            >
              <option value="recent">Recently added</option>
              <option value="name">Course name</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        <div
          className="filter-tabs category-filters"
          aria-label="Course categories"
        >
          <Link
            className={selected === "all" ? "selected" : ""}
            to={`/courses${search ? `?q=${encodeURIComponent(search)}` : ""}`}
          >
            All courses
          </Link>
          {categories.map((item) => (
            <Link
              key={item._id}
              className={selected === categorySlug(item.name) ? "selected" : ""}
              to={`/catalog/${categorySlug(item.name)}${
                search ? `?q=${encodeURIComponent(search)}` : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {loading ? (
          <LoadingState message="Opening the course library…" />
        ) : error ? (
          <ErrorState retry={retry} />
        ) : (
          <>
            <div className="catalog-results">
              <p>
                <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "course" : "courses"}
                {search ? ` for “${search}”` : " to spark your curiosity"}
              </p>
              {(search || selected !== "all") && (
                <Link to="/courses" className="text-link">
                  Clear filters
                </Link>
              )}
            </div>
            {filtered.length ? (
              <div className="course-grid">
                {filtered.map((course, index) => (
                  <CourseCard key={course._id} course={course} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="A different search could be your spark"
                description="No courses match these filters yet. Try another topic or browse the full library."
                action="Explore all courses"
                to="/courses"
              />
            )}
          </>
        )}
      </section>
      <div className="catalog-help container">
        <span className="note-icon">
          <FiBookOpen />
        </span>
        <div>
          <h2>Not sure where to start?</h2>
          <p>
            Tell us what you’re curious about. We’ll help you find your next
            step.
          </p>
        </div>
        <Link to="/contact" className="button button-secondary">
          Talk to us
        </Link>
      </div>
      <Footer />
    </>
  )
}
