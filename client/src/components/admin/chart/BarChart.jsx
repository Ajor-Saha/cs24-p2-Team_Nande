import React from 'react'
import { Bar } from "react-chartjs-2";


const BarChart = ({ chartData }) => {
    
  return (
    <div className="chart-container w-[400px] h-96">
      <h2 className='text-lg font-semibold text-center'>Waste Statistics</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Waste Collected by Each STS This Month Visualized in Graphical Statistics"
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

export default BarChart
