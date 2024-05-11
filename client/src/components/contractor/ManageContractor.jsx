import {
  Button,
  Card,
  Label,
  Modal,
  Table,
  Tabs,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { FaChartArea } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const ManageContractor = ({ companyName }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [contractor, setContractor] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contractorManagers, setContractorManagers] = useState([]);

  const fetchContructorByName = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/contractor/getContructorbyName/${companyName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contructor details");
      }
      const data = await response.json();
      setContractor(data.data);
    } catch (error) {
      console.error("Error fetching Contructor details:", error);
      setErrorMessage("Failed to fetch Contructor details");
    } finally {
      setLoading(false);
    }
  };

  const fetchContractorMangers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/contractor/getContactorManagers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contructor managers");
      }
      const data = await response.json();
      setContractorManagers(data.data);
    } catch (error) {
      console.error("Error fetching Contructor managers:", error);
      setErrorMessage("Failed to fetch Contructor managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContructorByName();
    fetchContractorMangers();
  }, [companyName, accessToken]);

  const handleAssignManager = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/contractor/assignContructorManager/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ companyName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to assign manager to Contractor");
      }
      const data = await response.json();
      setSuccessMessage(
        data.message || "Manager assigned to Contractor successfully."
      );
      setLoading(false);
      fetchContractorMangers();
    } catch (error) {
      console.error("Error assigning manager to Contructor:", error);
      setErrorMessage("Failed to assign manager to Contructor");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmit = () => {};

  
  return (
    <div className="overflow-x-scroll md:mx-auto p-3  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg font-bold text-center py-2">
        Manage contructor {companyName}
      </h1>
      <div className="overflow-x-auto flex flex-col justify-center items-center">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title="Contructor Information" icon={FaChartArea}>
            <Card className="w-[450px]">
              <p>
                <strong>Company Name:</strong> {contractor.companyName}
              </p>
              <p>
                <strong>Contract ID:</strong> {contractor.contractId}
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {contractor.registrationDate}
              </p>
              <p>
                <strong>TIN:</strong> {contractor.tin}
              </p>
              <p>
                <strong>Contact Number:</strong> {contractor.contactNumber}
              </p>
              <p>
                <strong>Workforce Size:</strong> {contractor.workforceSize}
              </p>
              <p>
                <strong>Payment Per Tonnage:</strong>{" "}
                {contractor.paymentPerTonnage} Tk
              </p>
              <p>
                <strong>Required Waste Per Day:</strong>{" "}
                {contractor.requiredWastePerDay} ton
              </p>
              <p>
                <strong>Contract Duration:</strong>{" "}
                {contractor.contractDuration} month
              </p>
              <p>
                <strong>Latitude:</strong>{" "}
                {contractor.areaOfCollection?.latitude}
              </p>
              <p>
                <strong>Longitude:</strong>{" "}
                {contractor.areaOfCollection?.longitude}
              </p>
              <p>
                <strong>Designated STS:</strong> {contractor.designatedSTS}
              </p>
              {/* Add more fields as needed */}
            </Card>
            <div className="py-5">
              <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
                Managers list for this {companyName}
              </h3>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>username</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Delete Manager</Table.HeadCell>
                </Table.Head>
                {contractor.managers?.map((manager) => (
                  <Table.Body className="divide-y" key={manager._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{manager.username}</Table.Cell>
                      <Table.Cell>{manager.email}</Table.Cell>
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
          </Tabs.Item>
          <Tabs.Item title="Assign New Manager" icon={HiPlus}>
            <h3 className="text-center py-2">
              Assign Contrator manager to this company
            </h3>
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>username</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Add this user</Table.HeadCell>
                </Table.Head>
                {contractorManagers.map((newsts) => (
                  <Table.Body className="divide-y" key={newsts._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{newsts.username}</Table.Cell>
                      <Table.Cell>{newsts.email}</Table.Cell>
                      <Table.Cell>
                        <Button onClick={() => handleAssignManager(newsts._id)}>
                          <HiPlus className="mr-2 h-5 w-5" />
                          Add
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </>

            
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageContractor;
