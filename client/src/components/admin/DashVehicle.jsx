import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpeg";
import { BASE_URL } from "../../apiConfig";
import AddNewUser from "./AddNewUser";
import AddNewVehicle from "./AddNewVehicle";

const DashVehicle= () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vehicle_reg_number, setVehicle_reg_number] = useState(null);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/vehicle/getallvehicle`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setVehicles(data.data);
    } catch (error) {
      console.error("Errro fetching vehicles", error);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      const response = await fetch(`${BASE_URL}/vehicle/deletevehicle/${vehicle_reg_number}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles((prev) => prev.filter((vehicle) => vehicle.vehicle_reg_number !== vehicle_reg_number));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-center items-center py-1 mb-1">
        <AddNewVehicle />
      </div>
      {currentUser.isAdmin && vehicles.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
              <Table.HeadCell>Capacity</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>cost_unloaded(perkm)</Table.HeadCell>
              <Table.HeadCell>cost_loaded(perkm)</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
            {vehicles.map((vehicle) => (
              <Table.Body className="divide-y" key={vehicle._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                  {vehicle.vehicle_reg_number}
                  </Table.Cell>
                  <Table.Cell>{vehicle.capacity}</Table.Cell>
                  <Table.Cell>{vehicle.type}</Table.Cell>
                  <Table.Cell>{vehicle.fuel_cost_unloaded}</Table.Cell>
                  <Table.Cell>{vehicle.fuel_cost_loaded}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setVehicle_reg_number(vehicle.vehicle_reg_number)
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard?tab=manageVehicle&vehicle_reg_number=${vehicle.vehicle_reg_number}`}>
                      Manage
                    </Link>{" "}
                    {/* Manage field */}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteVehicle}>
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
  );
};

export default DashVehicle;
