import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";

const ManageVehicle = ({ vehicle_reg_number }) => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [vehicle, setVehicle] = useState({});
  const [message, setMessage] = useState("");
  const [vehicleAssignment, setVehicleAssignment] = useState(false);
  const [stsDetails, setStsDetails] = useState([]);

  useEffect(() => {
    const fetchVehicleByReg = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/vehicle/getvehicle/${vehicle_reg_number}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle details");
        }
        const vehicleData = await response.json();
        setVehicle(vehicleData.data);
        setFormData(vehicleData.data);
      } catch (error) {
        console.error("Error fetching vehicle details", error);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle_reg_number) {
      fetchVehicleByReg();
      handleCheckAssignment();
      fetchSTS();
    }
  }, [vehicle_reg_number, accessToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vehicle) {
    return <p>Vehicle not found</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/vehicle/updatevehicle/${vehicle_reg_number}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedVehicle = await response.json();
      setSuccessMessage("Vehicle updated successfully");
      setVehicle(updatedVehicle.data);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setErrorMessage("Failed to update vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAssignment = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/vehicle/checkvehicleassignment/${vehicle_reg_number}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        if (typeof data.data === "object") {
          setMessage("Vehicle is available");
          setVehicleAssignment(true);
        } else {
          setMessage(
            `Vehicle is assigned to STS with ward number: ${data.data}`
          );
          setVehicleAssignment(false);
        }
      } else {
        setMessage("Failed to check vehicle assignment");
      }
    } catch (error) {
      console.error("Error checking vehicle assignment:", error);
      setMessage("Failed to check vehicle assignment");
      setLoading(false);
    }
  };

  //console.log(ward_number);
  const AssignVehicle = async (ward_number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/vehicle/assignvehicle/${vehicle_reg_number}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ward_number: ward_number }),
        }
      );
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setMessage(data.message || "Vehicle assigned to STS successfully");
        handleCheckAssignment();
      } else {
        setMessage(data.message || "Failed to assign vehicle to STS");
      }
    } catch (error) {
      console.error("Error assigning vehicle to STS:", error);
      setMessage("Failed to assign vehicle to STS");
      setLoading(false);
    }
  };

  const fetchSTS = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/sts/getallsts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setStsDetails(data.data);
      
    } catch (error) {
      console.error("Errro fetching users", error);
    }
  };
   

  
  

  return (
    <div className="table-auto overflow-x-scroll mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Card className="w-96 lg:w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Update vehicle details
            </h3>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="vehicle_reg_number"
                  value="Vehicle_reg_number"
                />
              </div>
              <TextInput
                id="vehicle_reg_number"
                name="vehicle_reg_number"
                placeholder="1,2.."
                type="number"
                onChange={handleChange}
                value={formData.vehicle_reg_number || ""}
                required
                disabled
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="type" value="Select vehicle type" />
              </div>
              <Select
                id="type"
                required
                onChange={handleChange}
                value={formData.type || ""}
              >
                <option value="Open Truck">Open Truck</option>
                <option value="Dump Truck">Dump Truck</option>
                <option value="Compactor">Compactor</option>
                <option value="Container Carrier">Container Carrier</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="capacity" value="capacity" />
              </div>
              <TextInput
                id="capacity"
                name="capacity"
                type="number"
                placeholder="3,5,7"
                onChange={handleChange}
                value={formData.capacity}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fuel_cost_loaded" value="fuel_cost_loaded" />
              </div>
              <TextInput
                id="fuel_cost_loaded"
                name="fuel_cost_loaded"
                type="number"
                placeholder="10,15,20"
                onChange={handleChange}
                value={formData.fuel_cost_loaded}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="fuel_cost_unloaded"
                  value="fuel_cost_unloaded"
                />
              </div>
              <TextInput
                id="fuel_cost_unloaded"
                name="fuel_cost_unloaded"
                type="number"
                placeholder="10,15,20"
                onChange={handleChange}
                value={formData.fuel_cost_unloaded}
                required
              />
            </div>

            <div className="w-full">
              <Button className="text-lg font-sans" type="submit">
                {loading ? "Loading..." : "Update Vehicle"}
              </Button>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mt-2">{successMessage}</p>
            )}
          </div>
        </form>
      </Card>
      <div className="py-5 items-center">
        {message && (
          <Button color="gray" pill className="w-96">
            {message}
          </Button>
        )}
        {vehicleAssignment && (
          <div className="overflow-x-auto py-5">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Ward Number</th>
                <th>Total Vehicle</th>
                <th>Assign this vehicle</th>
              </tr>
            </thead>
            <tbody>
            {stsDetails.map((sts, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-base-200" : ""}>
                    <td>{sts.ward_number}</td>
                    <td>{sts.vehicles.length}</td>
                    <td className="ml-5 text-sm"><Button  color="light" pill onClick={() => AssignVehicle(sts.ward_number)}>Assign</Button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicle;
