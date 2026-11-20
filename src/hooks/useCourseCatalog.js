import { useCallback, useEffect, useState } from "react"

import { apiConnector } from "../services/apiConnector"
import { categories as categoryApi, courseEndpoints } from "../services/apis"

export const categorySlug = (name = "") =>
  name.trim().toLowerCase().replace(/\s+/g, "-")
let catalogRequest
function loadCatalog() {
  if (!catalogRequest) {
    catalogRequest = Promise.all([
      apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API),
      apiConnector("GET", categoryApi.CATEGORIES_API),
    ])
      .then(([courseResponse, categoryResponse]) => {
        if (!courseResponse.data.success || !categoryResponse.data.success)
          throw new Error("Course data is unavailable")
        const categories = categoryResponse.data.data || []
        const courses = (courseResponse.data.data || []).map((course) => ({
          ...course,
          category: course.category?.name
            ? course.category
            : categories.find((category) =>
                category.courses?.some(
                  (id) => String(id?._id || id) === String(course._id)
                )
              ),
        }))
        return { courses, categories }
      })
      .catch((error) => {
        catalogRequest = undefined
        throw error
      })
      .finally(() => {
        catalogRequest = undefined
      })
  }
  return catalogRequest
}
export default function useCourseCatalog() {
  const [state, setState] = useState({
    courses: [],
    categories: [],
    loading: true,
    error: false,
  })
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setState((previous) => ({ ...previous, loading: true, error: false }))
    loadCatalog()
      .then((data) => {
        if (active) setState({ ...data, loading: false, error: false })
      })
      .catch(() => {
        if (active)
          setState({ courses: [], categories: [], loading: false, error: true })
      })
    return () => {
      active = false
    }
  }, [revision])
  const retry = useCallback(() => {
    catalogRequest = undefined
    setRevision((value) => value + 1)
  }, [])
  return { ...state, retry }
}
