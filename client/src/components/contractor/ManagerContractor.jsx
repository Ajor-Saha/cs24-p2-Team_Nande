import { Button, Card, Label, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../apiConfig";
import { useSelector } from "react-redux";

const ManagerContractor = () => {
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contrctorDetails, setContractorDetails] = useState({});
  const [workerDetails, setWorkerDetails] = useState([]);
  const [loadinga, setLoadinga] = useState(false);
  const [workingHour, setWorkingHour] = useState([]);
  const [wasteCollection, setWasteCollection] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    password: "",
    role: "Worker",
    refreshToken: "",
    phoneNumber: "",
    dateOfBirth: "",
    dateOfHire: "",
    jobTitle: "",
    paymentRatePerHour: "",
    latitude: "",
    longitude: "",
  });

  const [wastePlanData, setWastePlanData] = useState({
    areaOfCollection: "",
    collectionStartTime: "",
    durationForCollection: "",
    numberOfLaborers: "",
    numberOfVans: "",
    expectedWeightOfDailyWaste: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/worker/addWorker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create Worker");
      } else {
        setSuccessMessage(data.message || "Worker created successfully");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create New Woker.");
    }
  };

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

  const fetchWorkerDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/worker/getAllWorkerByCompanyName/${contrctorDetails.companyName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setWorkerDetails(data.data);
    } catch (error) {
      console.error("Error fetching worker Details:", error);
    }
  };

  const fetchWorkingHourDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contractor/getAllWorkersAndWorkHours/${contrctorDetails.companyName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setWorkingHour(data.data)
    } catch (error) {
      console.error("Error fetching worker Details:", error);
    }
  };


  useEffect(() => {
    fetchContractorDetails();
  }, [accessToken]);

  useEffect(() => {
    fetchWorkingHourDetails();
  }, [contrctorDetails])

  useEffect(() => {
    fetchWorkerDetails();
  }, [contrctorDetails]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleclick = async() =>{
    try {
      setLoadinga(false);
      const res = await fetch(`${BASE_URL}/worker/updateWorkHour`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        
      });
      const data = await res.json();
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangePlan = (e) => {
    const { id, value } = e.target;
    setWastePlanData({ ...formData, [id]: value });
  }

  const handlePlan = async() => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/contractor/addWasteCollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(wastePlanData),
      });
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create waste collection plan");
      } else {
        setSuccessMessage(data.message || "Waste collection plan created successfully");
        // Reset form data after successful submission
        setWastePlanData({
          areaOfCollection: "",
          collectionStartTime: "",
          durationForCollection: "",
          numberOfLaborers: "",
          numberOfVans: "",
          expectedWeightOfDailyWaste: "",
        });
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create waste collection plan");
    }
  }

  const fetchWasteCollection = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/contractor/getAllWasteCollection`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setWasteCollection(data.data)
    } catch (error) {
      console.error("Error fetching worker Details:", error);
    }
  };

  useEffect(() => {
    fetchWasteCollection();
  }, [accessToken])

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="py-10">
        <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
        Monitoring Logged Working Hours
        </h3>
        <Button color="light" onClick={handleclick} pill>UpdateMonitoring Data </Button>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Employee Id</Table.HeadCell>
            <Table.HeadCell>totalHoursWorked</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>overtimeHours</Table.HeadCell>
            <Table.HeadCell>absences</Table.HeadCell>
          </Table.Head>
          {workingHour.map((worker) => (
            <Table.Body className="divide-y" key={worker._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{worker.employeeId}</Table.Cell>
                <Table.Cell>{worker.totalHoursWorked}</Table.Cell>
                <Table.Cell>{worker.date}</Table.Cell>
                <Table.Cell>{worker.overtimeHours}</Table.Cell>
                <Table.Cell>{worker.absences}</Table.Cell>
                
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        </div>
      <Card className="w-[450px] mt-10 lg:w-[500px] mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new Worker to this company
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fullName" value="Full Name" />
              </div>
              <TextInput
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeId" value="Employee ID" />
              </div>
              <TextInput
                id="employeeId"
                name="employeeId"
                type="number"
                placeholder="Employee ID"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phoneNumber" value="Phone Number" />
              </div>
              <TextInput
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                type="text"
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateOfBirth" value="Date of Birth" />
              </div>
              <TextInput
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateOfHire" value="Date of Hire" />
              </div>
              <TextInput
                id="dateOfHire"
                name="dateOfHire"
                type="date"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jobTitle" value="Job Title" />
              </div>
              <TextInput
                id="jobTitle"
                name="jobTitle"
                placeholder="Job Title"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="paymentRatePerHour"
                  value="Payment Rate Per Hour"
                />
              </div>
              <TextInput
                id="paymentRatePerHour"
                name="paymentRatePerHour"
                placeholder="Payment Rate Per Hour"
                type="number"
                step="any"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="latitude" value="Latitude" />
              </div>
              <TextInput
                id="latitude"
                name="latitude"
                placeholder="Latitude"
                type="number"
                step="any"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="longitude" value="Longitude" />
              </div>
              <TextInput
                id="longitude"
                name="longitude"
                placeholder="Longitude"
                type="number"
                step="any"
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <Button
                className="text-lg font-sans"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add New Worker"}
              </Button>
            </div>
          </div>
        </form>
        {successMessage && <p>{successMessage}</p>}
      </Card>
      <div className="py-10">
        <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
          Worker list for {contrctorDetails.companyName}
        </h3>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>username</Table.HeadCell>
            <Table.HeadCell>email</Table.HeadCell>
            <Table.HeadCell>Employee Id</Table.HeadCell>
            <Table.HeadCell>Date of Hire</Table.HeadCell>
            <Table.HeadCell>Job Title</Table.HeadCell>
            <Table.HeadCell>PaymentPerHour</Table.HeadCell>
            <Table.HeadCell>Delete Manager</Table.HeadCell>
          </Table.Head>
          {workerDetails.map((worker) => (
            <Table.Body className="divide-y" key={worker._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{worker.fullName}</Table.Cell>
                <Table.Cell>{worker.email}</Table.Cell>
                <Table.Cell>{worker.employeeId}</Table.Cell>
                <Table.Cell>{worker.dateOfHire}</Table.Cell>
                <Table.Cell>{worker.jobTitle}</Table.Cell>
                <Table.Cell>{worker.paymentRatePerHour}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {}}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
      <div>
      <Card className="w-[450px] mt-10 lg:w-[500px] mx-auto">
        <form onSubmit={handlePlan}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new Collection Plan
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="areaOfCollection" value="areaOfCollection" />
              </div>
              <TextInput
                id="areaOfCollection"
                name="areaOfCollection"
                placeholder="Dhaka"
                type="text"
                onChange={handleChangePlan}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="collectionStartTime" value="collectionStartTime" />
              </div>
              <TextInput
                id="collectionStartTime"
                name="collectionStartTime"
                
                type='date'
                onChange={handleChangePlan}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="durationForCollection" value="durationForCollection" />
              </div>
              <TextInput
                id="durationForCollection"
                name="durationForCollection"
                type="number"
                placeholder="durationForCollection"
                onChange={handleChangePlan}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="numberOfLaborers" value="numberOfLaborers" />
              </div>
              <TextInput
                id="numberOfLaborers"
                name="numberOfLaborers"
                placeholder="Number"
                type="Number"
                onChange={handleChangePlan}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="numberOfVans" value="numberOfVans" />
              </div>
              <TextInput
                id="numberOfVans"
                name="numberOfVans"
                placeholder="numberOfVans"
                type="number"
                onChange={handleChangePlan}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="expectedWeightOfDailyWaste" value="expectedWeightOfDailyWaste" />
              </div>
              <TextInput
                id="expectedWeightOfDailyWaste"
                name="expectedWeightOfDailyWaste"
                placeholder="expectedWeightOfDailyWaste"
                type="number"
                onChange={handleChangePlan}
              />
            </div>

            
            <div className="w-full">
              <Button
                className="text-lg font-sans"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add New Worker"}
              </Button>
            </div>
          </div>
        </form>
        {successMessage && <p>{successMessage}</p>}
      </Card>
      </div>
      <div>
      <div className="py-10">
        <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
          Waste Collection Plan for Contractor Manager
        </h3>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>areaOfCollection</Table.HeadCell>
            <Table.HeadCell>collectionStartTime</Table.HeadCell>
            <Table.HeadCell>durationForCollection</Table.HeadCell>
            <Table.HeadCell>numberOfLaborers</Table.HeadCell>
            <Table.HeadCell>numberOfVans</Table.HeadCell>
            <Table.HeadCell>expectedWeightOfDailyWast</Table.HeadCell>
          </Table.Head>
          {wasteCollection.map((worker) => (
            <Table.Body className="divide-y" key={worker._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{worker.areaOfCollection}</Table.Cell>
                <Table.Cell>{worker.collectionStartTime}</Table.Cell>
                <Table.Cell>{worker.durationForCollection}</Table.Cell>
                <Table.Cell>{worker.numberOfLaborers}</Table.Cell>
                <Table.Cell>{worker.numberOfVans}</Table.Cell>
                <Table.Cell>{worker.expectedWeightOfDailyWaste}</Table.Cell>
                
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
      </div>
    </div>
  );
};

export default ManagerContractor;
