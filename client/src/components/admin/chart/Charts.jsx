// PieChart.js
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import { Data } from "../../../utils/Data";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { BASE_URL } from "../../../apiConfig";
import { useSelector } from "react-redux";
Chart.register(CategoryScale);

const Charts = () => {
  const [stsWaste, setStsWaste] = useState([]);
  const { currentUser, accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    fetchStsDetails();
  }, [accessToken])

  

  const fetchStsDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getallstswaste`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transportation details");
      }
      const data = await response.json();
      setStsWaste(data.data);
    } catch (error) {
      console.error("Errro fetching transporation details", error);
    }
  };

  const chartData = {
    labels: stsWaste.map((data) => data.ward_number),
    datasets: [
      {
        label: "Waste Collected",
        data: stsWaste.map((data) => data.totalWaste),
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  
  

   
  return (
    <div className="py-12 flex flex-wrap gap-10 justify-evenly">
      <div>
      <PieChart chartData={chartData} />
      </div>
      <div>
        <BarChart chartData={chartData} />
      </div>
      <div>
        <LineChart chartData={chartData} />
      </div>
    </div>
  );
};

export default Charts;
