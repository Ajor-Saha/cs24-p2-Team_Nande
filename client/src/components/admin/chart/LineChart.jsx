import React from 'react'
import { Line } from "react-chartjs-2";

const LineChart = ({ chartData }) => {
  return (
    <div className="chart-container w-[400px] h-96">
      <h2 style={{ textAlign: "center" }}>Waste Statistics</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Waste Collected by Each STS this month"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  )
}

export default LineChart
