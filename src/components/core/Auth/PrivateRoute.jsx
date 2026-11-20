// This will prevent non-authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const location = useLocation()

  if (token !== null) {
    return children
  } else {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    )
  }
}

export default PrivateRoute
