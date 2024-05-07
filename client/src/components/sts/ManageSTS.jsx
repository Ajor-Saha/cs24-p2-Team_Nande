import { Button, Modal, Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { FaChartArea } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const ManageSTS = ({ ward_number }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [sts, setSts] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    capacity: "",
    latitude: "",
    longitude: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [managersId, setManagersId] = useState([]);
  const [managersDetails, setManagersDetails] = useState([]);
  const [newSTSManagers, setNewSTSManagers] = useState([]);
  const [stsmanagerId, setDeleteMangerId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState([]);

  const fetchSTSByWardNumber = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/sts/getsts/${ward_number}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch STS details");
      }
      const data = await response.json();
      setFormData({
        capacity: data.data.capacity,
        latitude: data.data.gps_coordinates?.latitude,
        longitude: data.data.gps_coordinates?.longitude,
      });
      setManagersId(data.data?.managers);
      setSts(data.data);
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

  const fetchNewSTSManagers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getavailablestsmanagers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch new STS managers");
      }
      const data = await response.json();
      setNewSTSManagers(data.data);
    } catch (error) {
      console.error("Error fetching new STS managers:", error);
    }
  };

  const fetchStsVehicles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getvehicleofsts/${ward_number}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles Details");
      }
      const data = await response.json();
      setVehicleDetails(data.data);
    } catch (error) {
      console.error("Error fetching vehicles details", error);
    }
  };

  useEffect(() => {
    fetchSTSByWardNumber();
    fetchManagersDetails();
    fetchNewSTSManagers();
    fetchStsVehicles();
  }, [ward_number, accessToken, managersId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const response = await fetch(`${BASE_URL}/sts/updatests/${ward_number}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update STS data");
      }
      const data = await response.json();
      setSuccessMessage(data.message || "STS data updated successfully.");
    } catch (error) {
      console.error("Error updating STS:", error);
      setErrorMessage("Failed to update STS data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/sts/assignsts/${sts._id}/${userId}`,
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
      // Fetch new STS managers list
      fetchNewSTSManagers();
    } catch (error) {
      console.error("Error assigning manager to STS:", error);
      setErrorMessage("Failed to assign manager to STS");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManager = async () => {
    const userId = stsmanagerId;
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/sts/delestsmanager/${sts._id}/${userId}`,
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
        Manage {ward_number} STS{" "}
      </h1>
      <div className="overflow-x-auto flex flex-col justify-center items-center">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title="STS Information" icon={FaChartArea}>
            <div className="flex flex-col justify-center items-center">
              <form
                className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-6 mb-1">
                  <div className="py-2">
                    <h6 className="block -mb-3  py-2 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                      Ward Number : {sts.ward_number}
                    </h6>
                  </div>

                  <h6 className="block -mb-3 py-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    STS Capacity
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="capacity"
                      name="capacity"
                      type="text"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 py-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Latitude
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    />
                  </div>
                  <h6 className="block -mb-3 py-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Longitude
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    />
                  </div>
                </div>
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit"
                >
                  {/* {loading ? "Loading..." : "Update Role"} */}
                  Update sts data
                </button>
              </form>
              <div className="py-5">
                <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
                  Managers list for this sts(ward_number is {ward_number})
                </h3>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>username</Table.HeadCell>
                    <Table.HeadCell>email</Table.HeadCell>
                    <Table.HeadCell>Delete Manager</Table.HeadCell>
                  </Table.Head>
                  {managersDetails.map((newsts) => (
                    <Table.Body className="divide-y" key={newsts._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{newsts.username}</Table.Cell>
                        <Table.Cell>{newsts.email}</Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setDeleteMangerId(newsts._id);
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
                <div className="py-5">
                  <h1 className="font-semibold pb-2 text-center text-lg pt-2">Vehicle List of this STS:</h1>
                  <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
                    <Table.HeadCell>Vehicle Capacity</Table.HeadCell>
                    <Table.HeadCell>Vehicle Type</Table.HeadCell>
                  </Table.Head>
                  {vehicleDetails.map((vehicle) => (
                    <Table.Body className="divide-y" key={vehicle._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{vehicle.vehicle_reg_number}</Table.Cell>
                        <Table.Cell>{vehicle.capacity}</Table.Cell>
                        <Table.Cell>
                          {vehicle.type}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
                </div>
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
                      Are you sure you want to delete this sts manager?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={handleDeleteManager}>
                        Yes, I'm sure
                      </Button>
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
            <h3 className="text-center py-2">Assign STS manager to this STS</h3>
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>username</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Add this user</Table.HeadCell>
                </Table.Head>
                {newSTSManagers.map((newsts) => (
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

export default ManageSTS;
