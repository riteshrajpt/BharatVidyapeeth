import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import { LoadingState } from "../components/Common/PageState"
import Sidebar from "../components/core/Dashboard/Sidebar"

export default function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  if (profileLoading || authLoading)
    return <LoadingState message="Opening your learning space…" />
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content legacy-workspace">
        <Outlet />
      </div>
    </div>
  )
}
