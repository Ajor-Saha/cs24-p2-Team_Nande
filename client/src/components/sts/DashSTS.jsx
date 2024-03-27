import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";
import AddNewSTS from "./AddNewSTS";


const DashSTS= () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [sts, setSts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ward_number, setWard_number] = useState(null);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    fetchSTS();
  }, []);

  

  const fetchSTS = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getallsts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch STS");
      }

      const data = await response.json();
      setSts(data.data);
    } catch (error) {
      console.error("Error fetching STS:", error);
    }
  };

  const handleDeleteSTS = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/deletests/${ward_number}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete STS");
      }

      // Remove the deleted STS from the local state
      setSts((prevSts) => prevSts.filter((st) => st.ward_number !== ward_number));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

 //console.log(sts);
  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-center items-center py-2 mb-1">
        <AddNewSTS />
      </div>
      {currentUser.isAdmin && sts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ward_Number</Table.HeadCell>
              <Table.HeadCell>Capacity</Table.HeadCell>
              <Table.HeadCell>Latitude</Table.HeadCell>
              <Table.HeadCell>Longitude</Table.HeadCell>
              <Table.HeadCell>Assigned Managers</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
            {sts.map((st) => (
            <Table.Body className="divide-y" key={st._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                <Table.Cell>{st.ward_number}</Table.Cell>
                <Table.Cell>{st.capacity}</Table.Cell>
                <Table.Cell>{st.gps_coordinates.latitude}</Table.Cell>
                <Table.Cell>{st.gps_coordinates.longitude}</Table.Cell>
                <Table.Cell>{st.managers.length}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setWard_number(st.ward_number);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>Manage</Table.Cell>
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
              Are you sure you want to delete this STS?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteSTS}>
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

export default DashSTS;
