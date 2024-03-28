import { Button, Modal, Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { FaChartArea } from "react-icons/fa6";
import { GiIsland } from "react-icons/gi";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const ManageLandFill = ({ landFill_name }) => {
  const [showModal, setShowModal] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  const [landFill, setLandFill] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(landFill_name);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [managersId, setManagersId] = useState([]);
  const [managersDetails, setManagersDetails] = useState([]);
  const [newLandfillManagers, setNewLandfillManagers] = useState([]);
  const [landfillmanagerId, setDeleteMangerId] = useState(null);


  const fetchLandfillByName = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/landfill/getlandfill/${name}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Landfill details");
      }
      const data = await response.json();
      
      setManagersId(data.data?.manager);
      setName(data.data.name);
      setLandFill(data?.data);
    } catch (error) {
      console.error("Error fetching STS details:", error);
      setErrorMessage("Failed to fetch STS details");
    } finally {
      setLoading(false);
    }
  };

  const fetchManagersDetails = async () => {
    try {
      const userDetailsArray = [];
      for (const userId of managersId) {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch user details for manager ID: ${userId}`
          );
        }
        const userDetails = await response.json();
        userDetailsArray.push(userDetails.data);
      }
      setManagersDetails(userDetailsArray);
    } catch (error) {
      console.error("Error fetching manager details:", error);
    }
  };

  const fetchNewLandFillManagers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/landfill/getavailablelandManagers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch new STS managers");
      }
      const data = await response.json();
      setNewLandfillManagers(data.data);
    } catch (error) {
      console.error("Error fetching new STS managers:", error);
    }
  };

  useEffect(() => {
    fetchLandfillByName();
    fetchManagersDetails();
    fetchNewLandFillManagers();
  }, [name,managersId]);
  //console.log(newLandfillManagers);
 // console.log(landFill);

 const handleAssignManager = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/landfill/assignlandfillmanager/${landFill._id}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to assign manager to STS");
      }
      const data = await response.json();
      setSuccessMessage(
        data.message || "Manager assigned to STS successfully."
      );
      // Fetch updated managers list
      fetchManagersDetails();
    } catch (error) {
      console.error("Error assigning manager to STS:", error);
      setErrorMessage("Failed to assign manager to STS");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManager = async () => {
    const userId = landfillmanagerId;
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/landfill/deletelandfillmanager/${landFill._id}/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete manager from STS");
      }
      const data = await response.json();
      setSuccessMessage(
        data.message || "Manager deleted from STS successfully."
      );

      fetchManagersDetails();
      
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting manager from STS:", error);
      setErrorMessage("Failed to delete manager from STS");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="overflow-x-scroll md:mx-auto p-3  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg font-bold text-center py-2">
        Manage Landfill {landFill_name}
      </h1>
      <div className="overflow-x-auto flex flex-col justify-center items-center">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title="LandFill Information" icon={GiIsland}>
            <div>
              <div className="">
                <p className="py-2">
                  LandFill Name:{" "}
                  <span className="font-bold">{landFill_name}</span>
                </p>
                <p className="py-2">
                  Capacity: <span className="font-bold">{landFill?.capacity || ""}</span>
                </p>
                {/* <p className="py-2">
                  StartTime: <span className="font-bold">{landFill?.operationalTimespan.startTime || ""}</span>
                </p>
                <p className="py-2">
                  EndTime: <span className="font-bold">{landFill?.operationalTimespan.endTime || ""}</span>
                </p>
                <p className="py-2">
                  latitude: <span className="font-bold">{landFill?.gps_coordinates.latitude || ""}</span>
                </p>
                <p className="py-2">
                  longitude: <span className="font-bold">{landFill?.gps_coordinates.longitude || ""}</span>
                </p>  */}
              </div>
              <div className="py-5">
                <h3 className="text-center text-gray-800 py-2 font-semibold">
                  Managers list for this LandFill
                </h3>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>username</Table.HeadCell>
                    <Table.HeadCell>email</Table.HeadCell>
                    <Table.HeadCell>Delete Manager</Table.HeadCell>
                  </Table.Head>
                  {managersDetails.map((manager) => (
                    <Table.Body className="divide-y" key={manager._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{manager.username}</Table.Cell>
                        <Table.Cell>{manager.email}</Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setDeleteMangerId(manager._id);
                            }}
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
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                    <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this landFill manager?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={handleDeleteManager}>Yes, I'm sure</Button>
                      <Button color="gray" onClick={() => setShowModal(false)}>
                        No, cancel
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Assign New Manager" icon={HiPlus}>
            <h3 className="text-center py-2">Assign LandFill manager to this LandFill(all available manager)</h3>
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>username</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Add this user</Table.HeadCell>
                </Table.Head>
                {newLandfillManagers.map((newmanager) => (
                  <Table.Body className="divide-y" key={newmanager._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{newmanager.username}</Table.Cell>
                      <Table.Cell>{newmanager.email}</Table.Cell>
                      <Table.Cell>
                        <Button onClick={() => handleAssignManager(newmanager._id)}>
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

export default ManageLandFill;
