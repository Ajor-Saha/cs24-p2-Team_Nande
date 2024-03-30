import { Button, Label, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const ManagerLandfill = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [landFillDetails, setLandFillDetails] = useState({});
  const [isLandfillManager, setLandfillManager] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [landFillEntries, setLandFillEntries] = useState([]);

  useEffect(() => {
    const userId = currentUser._id;
    const fetchLandFill = async () => {
      setLandfillManager(false);
      try {
        const response = await fetch(
          `${BASE_URL}/landfill/finduserlandfill/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLandFillDetails(data.data);
          setLandfillManager(true);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
        setLandfillManager(false);
      }
    };

    if (userId) {
      fetchLandFill();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchLandfillEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/landfill/findlandfillentries`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch STSEntries");
        }
        const data = await response.json();
        setLandFillEntries(data.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchLandfillEntries();
  }, [landFillDetails]);

  const [formData, setFormData] = useState({
    vehicle_reg_number: 0,
    weight_of_waste: 0,
    time_of_arrival: "",
    time_of_departure: "",
    distance_traveled: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const landfill_name = landFillDetails.name;
    try {
      const res = await fetch(
        `${BASE_URL}/landfill/addlandfillentry/${landfill_name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing your request");
    }

    setLoading(false);
  };

  const handleGeneratePDF = async (landfillEntryId) => {
    const landEntry_id = landfillEntryId;
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/landfill/fuel_cost_report/${landEntry_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      // Open the PDF in a new window
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage("Failed to generate PDF");
    }
    setLoading(false);
  };

  return (
    <div className="overflow-x-scroll md:mx-auto p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div>
        <h1 className="px-10">Add Detail for a vehicle coming sts</h1>
        <form onSubmit={handleSubmit} className="w-96 px-10">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new LandFill Entry to {landFillDetails.name} LandFill
            </h3>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="vehicle_reg_number"
                  value="Vehicle Registration Number"
                />
              </div>
              <TextInput
                id="vehicle_reg_number"
                name="vehicle_reg_number"
                placeholder="Enter Vehicle Registration Number"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
            <div>
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="time_of_arrival" value="Time of Arrival" />
              </div>
              <TextInput
                id="time_of_arrival"
                name="time_of_arrival"
                type="datetime-local"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="time_of_departure" value="Time of Departure" />
              </div>
              <TextInput
                id="time_of_departure"
                name="time_of_departure"
                type="datetime-local"
                onChange={handleChange}
                required
              />
            </div>
            <div>
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
            <div className="w-full">
              <Button className="text-lg font-sans" type="submit">
                {loading ? "Loading..." : "Add STS Entry"}
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
      </div>
      <div className="py-5">
        {landFillEntries.length > 0 ? (
          <>
            <h1 className="py-5 text-center">All LandFillEntry List</h1>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
                <Table.HeadCell>Weight_of_waste</Table.HeadCell>
                <Table.HeadCell>time_of_arrival</Table.HeadCell>
                <Table.HeadCell>time_of_departure</Table.HeadCell>
                <Table.HeadCell>distance_traveled</Table.HeadCell>
                <Table.HeadCell>Generate_Billing_Slip</Table.HeadCell>
              </Table.Head>
              {landFillEntries.map((landfillEntry) => (
                <Table.Body className="divide-y" key={landfillEntry._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                    <Table.Cell>{landfillEntry.vehicle_reg_number}</Table.Cell>
                    <Table.Cell>{landfillEntry.weight_of_waste}</Table.Cell>
                    <Table.Cell>{landfillEntry.time_of_arrival}</Table.Cell>
                    <Table.Cell>{landfillEntry.time_of_departure}</Table.Cell>
                    <Table.Cell>{landfillEntry.distance_traveled}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => handleGeneratePDF(landfillEntry._id)}
                      >
                        Generate
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        ) : (
          <p>You have no entry yet!</p>
        )}
      </div>
    </div>
  );
};

export default ManagerLandfill;