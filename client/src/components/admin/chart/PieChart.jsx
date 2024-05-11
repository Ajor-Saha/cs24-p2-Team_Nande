// PieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ chartData }) => {
    
  return (
    <div className="chart-container w-[350px]">
      <h2 className="font-semibold text-xl text-center">Waste Statistics</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Waste Collected by Each STS this month"
            }
          }
        }}
      />
    </div>
  );
};

export default PieChart;
