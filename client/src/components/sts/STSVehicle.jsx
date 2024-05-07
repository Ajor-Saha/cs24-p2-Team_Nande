import { Button, Card, Label, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const STSVehicle = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [stsVehicleList, setStsVehicleList] = useState([]);
  const [ward_number, setWard_number] = useState(null);
  const [optimizedVehicles, setOptimizedVehicles] = useState([]);
  const [minCostVehicles, setMinCostVehicles] = useState([]);
  const [formData, setFormData] = useState({});
  const [totalWaste, setTotalWaste] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    fetchSTSVehicles();
  }, []);

  const fetchSTSVehicles = async () => {
    const userId = currentUser._id;
    try {
      const response = await fetch(`${BASE_URL}/sts/stsVehicleList/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch STS");
      }

      const data = await response.json();
      setStsVehicleList(data.data.vehiclesDetails);
      setWard_number(data.data.ward_number);
    } catch (error) {
      console.error("Error fetching STS:", error);
    }
  };
  
  

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/sts/getOptimizedVehicles/${ward_number}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch optimized vehicles");
      }

      const data = await response.json();
      setOptimizedVehicles(data.data);
      
    } catch (error) {
      console.error("Error fetching optimized vehicles:", error);
    }
  };

  const handleVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/sts/findOptimalVehicles/${ward_number}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalWaste }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch optimized vehicles");
      }

      const data = await response.json();
      setMinCostVehicles(data.data);
      
    } catch (error) {
      console.error("Error fetching min cost optimized vehicles:", error);
    }
  };


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg font-bold text-center py-2">
        STS Vehicle List <span>(ward_number :{ward_number})</span>
      </h1>
      {currentUser.role === "STS Manager" ? (
        <>
          {stsVehicleList.length > 0 ? (
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Vehicle Reg Number</Table.HeadCell>
                <Table.HeadCell>Capacity</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Cost Unloaded (per km)</Table.HeadCell>
                <Table.HeadCell>Cost Loaded (per km)</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {stsVehicleList.map((vehicle, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{vehicle.vehicle_reg_number}</Table.Cell>
                    <Table.Cell>{vehicle.capacity}</Table.Cell>
                    <Table.Cell>{vehicle.type}</Table.Cell>
                    <Table.Cell>{vehicle.fuel_cost_unloaded}</Table.Cell>
                    <Table.Cell>{vehicle.fuel_cost_loaded}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>This STS has no vehicles yet!</p>
          )}
        </>
      ) : (
        <p>You are not authorized to view this page.</p>
      )}
      <div className="flex flex-col justify-center items-center pt-14 pb-5">
        <Card className="w-[400px] lg:w-[500px]">
          <h3 className="font-semibold">
            Select the truck with the lowest fuel consumption or choose the
            truck optimized for cost efficiency.
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <div className="mb-2 block">
                <Label htmlFor="weight_of_waste" value="Weight of Waste" />
              </div>
              <TextInput
                id="weight_of_waste"
                name="weight_of_waste"
                placeholder="Enter Weight of Waste"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
            <div className="py-2">
              <div className="mb-2 block">
                <Label htmlFor="distance_traveled" value="Distance Traveled" />
              </div>
              <TextInput
                id="distance_traveled"
                name="distance_traveled"
                placeholder="Enter Distance Traveled"
                type="number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full py-3">
              <Button type="submit" outline gradientDuoTone="cyanToBlue">
                Find Vehicles
              </Button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <Table className="table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Capacity</th>
                  <th>Fuel Cost</th>
                </tr>
              </thead>
              <tbody>
                {optimizedVehicles.map((vehicle, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-base-200" : ""}>
                    <td>{vehicle.vehicle_reg_number}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.fuelCost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
      <div className="flex flex-col justify-center items-center pt-14 pb-5">
        <Card className="w-[400px] lg:w-[500px]">
          <h3 className="font-semibold">
            Fleet Optimiztion View or Select the truck with the lowest fuel consumption 
          </h3>
          <form onSubmit={handleVehicle}>
            <div className="py-2">
              <div className="mb-2 block">
                <Label htmlFor="totalWaste" value="Weight of Waste" />
              </div>
              <TextInput
                id="totalWaste"
                name="totalWaste"
                placeholder="Enter Weight of Waste"
                type="number"
                onChange={(e) => setTotalWaste(e.target.value)}
                required
              />
            </div>
            
            <div className="w-full py-3">
              <Button type="submit" outline gradientDuoTone="cyanToBlue">
                Find Vehicles
              </Button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <Table className="table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Capacity</th>
                  <th>Fuel Cost</th>
                  <th>Trips</th>
                </tr>
              </thead>
              <tbody>
                {minCostVehicles.map((vehicle, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-base-200" : ""}>
                    <td>{vehicle.vehicle_reg_number}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.fuelCostPerKilo.toFixed(2)}</td>
                    <td>{vehicle.trips}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default STSVehicle;
