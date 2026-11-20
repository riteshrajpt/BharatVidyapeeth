import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"

Chart.register(...registerables)
const palette = [
  "#137c56",
  "#9cbe78",
  "#e8aa79",
  "#8d85b5",
  "#67a7a5",
  "#d1b862",
]
export default function InstructorChart({ courses }) {
  const [view, setView] = useState("students")
  const data = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) =>
          view === "students"
            ? course.totalStudentsEnrolled
            : course.totalAmountGenerated
        ),
        backgroundColor: courses.map(
          (_, index) => palette[index % palette.length]
        ),
        borderColor: "#fff",
        borderWidth: 4,
      },
    ],
  }
  return (
    <div className="instructor-chart">
      <div className="filter-tabs">
        <button
          className={view === "students" ? "selected" : ""}
          onClick={() => setView("students")}
        >
          Enrolled learners
        </button>
        <button
          className={view === "income" ? "selected" : ""}
          onClick={() => setView("income")}
        >
          Course earnings
        </button>
      </div>
      <div className="chart-canvas">
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: { family: "DM Sans", size: 12 },
                  color: "#64746b",
                  padding: 20,
                  usePointStyle: true,
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}
