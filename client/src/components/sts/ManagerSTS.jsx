import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../apiConfig";
import { useSelector } from "react-redux";
import { Button, Label, Table, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const ManagerSTS = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [stsDetails, setSTSDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stsEntries, setSTSEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = currentUser._id;
    const fetchSTS = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/sts/userstsdetails/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSTSDetails(data.data);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
      }
    };

    if (userId) {
      fetchSTS();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchSTSEntries = async () => {
      const sts_id = stsDetails._id;
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/sts/getstsentries/${sts_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch STSEntries");
        }
        const data = await response.json();
        setSTSEntries(data.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchSTSEntries();
  }, [stsDetails]);

  const [formData, setFormData] = useState({
    vehicle_reg_number: "",
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
    const sts_id = stsDetails._id;
    try {
      const res = await fetch(`${BASE_URL}/sts/addstsentry/${sts_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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

  //console.log(stsEntries);

  return (
    <div className="overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div>
        <h1>Add Detail for a vehicle leaving this sts</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new STS Entry
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
                type="text"
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
      {stsEntries.length > 0 ? (
        <>
           <h1 className="py-5 text-center">All STSEntry List</h1>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
              <Table.HeadCell>Weight_of_waste</Table.HeadCell>
              <Table.HeadCell>time_of_arrival</Table.HeadCell>
              <Table.HeadCell>time_of_departure</Table.HeadCell>
              <Table.HeadCell>distance_traveled</Table.HeadCell>
              
            </Table.Head>
            {stsEntries.map((stEntry) => (
            <Table.Body className="divide-y" key={stEntry._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                <Table.Cell>{stEntry.vehicle_reg_number}</Table.Cell>
                <Table.Cell>{stEntry.weight_of_waste}</Table.Cell>
                <Table.Cell>{stEntry.time_of_arrival}</Table.Cell>
                <Table.Cell>{stEntry.time_of_departure}</Table.Cell>
                <Table.Cell>{stEntry.distance_traveled}</Table.Cell>
                
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

export default ManagerSTS;
