import React, { useEffect, useState } from "react";
import { Button, Card, Label, Table, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const VehiclesAndWaste = () => {
  const [formData, setFormData] = useState({
    vehicle_reg_number: "",
    type: "",
  });
  const [entryData, setEntryData] = useState({
    vehicle_reg_number: "",
    weightOfWaste: "",
  });
  const [entryDetails, setEntryDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { accessToken } = useSelector((state) => state.user);
  const [contrctorDetails, setContractorDetails] = useState({});

  const fetchContractorDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contractor/getContractorDetailsById`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch STS");
      }

      const data = await response.json();
      setContractorDetails(data.data);
    } catch (error) {
      console.error("Error fetching Contructor Details:", error);
    }
  };

  const fetchEntryDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contractor/getContractorEntryByCompanyName/${contrctorDetails.companyName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch entry details");
      }

      const data = await response.json();
      setEntryDetails(data.data);
    } catch (error) {
      console.error("Error fetching entry Details:", error);
    }
  };

  useEffect(() => {
    fetchContractorDetails();
  }, [accessToken]);

  useEffect(() => {
    fetchEntryDetails();
  }, [entryDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(
        `${BASE_URL}/contractor/addCompanyVehicle/${contrctorDetails.companyName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create Vehicles");
      } else {
        setSuccessMessage(
          data.message || "Vehicles created successfully"
        );
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create New Vehicle.");
    }
  };

  const handleEntry = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(
        `${BASE_URL}/contractor/addContractorEntry/${contrctorDetails.companyName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(entryData),
        }
      );
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create Entry");
      } else {
        setSuccessMessage(
          data.message || "Entry created successfully"
        );
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create New Entry.");
    }
  };

  const handleChangeEntry = (e) => {
    const { id, value } = e.target;
    setEntryData({ ...entryData, [id]: value });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Card className="w-[500px]">
        <h1>Manage Vehicles and Waste come from HouseHold</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="vehicle_reg_number"
                  value="Vehicle Number"
                />
              </div>
              <TextInput
                id="vehicle_reg_number"
                name="vehicle_reg_number"
                placeholder="Enter Vehicle Number"
                type="number"
                value={formData.vehicle_reg_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="type" value="Type" />
              </div>
              <TextInput
                id="type"
                name="type"
                type="text"
                placeholder="Enter vehicle Type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full">
              <Button
                className="text-lg font-sans"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add New vehicle"}
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
      <div className="py-12">
        <Card className="w-[500px]">
          <h1>Waste Entry Coming from HouseHolds</h1>
          <form onSubmit={handleEntry}>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="vehicle_reg_number"
                    value="Vehicle Number"
                  />
                </div>
                <TextInput
                  id="vehicle_reg_number"
                  name="vehicle_reg_number"
                  placeholder="Enter Vehicle Number"
                  type="number"
                  value={entryData.vehicle_reg_number}
                  onChange={handleChangeEntry}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="weightOfWaste" value="Weight of Waste" />
                </div>
                <TextInput
                  id="weightOfWaste"
                  name="weightOfWaste"
                  type="number"
                  placeholder="Enter Weight of Waste"
                  value={entryData.weightOfWaste}
                  onChange={handleChangeEntry}
                  required
                />
              </div>

              <div className="w-full">
                <Button
                  className="text-lg font-sans"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Add New Entry"}
                </Button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">
                  {successMessage}
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
      <div>
        <h1>All contractor Entry List</h1>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Vehicle Number</Table.HeadCell>
            <Table.HeadCell>Comapany Name</Table.HeadCell>
            <Table.HeadCell>weightOfWaste</Table.HeadCell>
            
          </Table.Head>
          {entryDetails.map((entry) => (
            <Table.Body className="divide-y" key={entry._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{entry.vehicle_reg_number}</Table.Cell>
                <Table.Cell>{entry.companyName}</Table.Cell>
                <Table.Cell>{entry.weightOfWaste}</Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default VehiclesAndWaste;
