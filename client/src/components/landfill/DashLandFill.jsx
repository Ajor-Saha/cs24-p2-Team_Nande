import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";
import AddNewSTS from "../sts/AddNewSTS";
import AddNewLandFill from "./AddNewLandFill";

const DashLandFill = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [landFill, setLandFill] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    fetchLandFill();
  }, []);

  const fetchLandFill = async () => {
    try {
      const response = await fetch(`${BASE_URL}/landfill/getlandfills`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LandFill");
      }

      const data = await response.json();
      setLandFill(data.data);
    } catch (error) {
      console.error("Error fetching Landfills", error);
    }
  };

  const handleDeleteLandfill = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/landfill/deletelandfill/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete STS");
      }

      setLandFill((prevLandFill) =>
        prevLandFill.filter((land) => land.name !== name)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting Landfill:", error);
      alert("Failed to delete Landfill: " + error.message);
    }
  };
  
  console.log(landFill);
  //console.log(sts);
 // console.log(landFill);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-center items-center py-2 mb-1">
        <AddNewLandFill />
      </div>
      {currentUser.isAdmin && landFill.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Lanfill Name</Table.HeadCell>
              <Table.HeadCell>Capacity</Table.HeadCell>
              <Table.HeadCell>Latitude</Table.HeadCell>
              <Table.HeadCell>Longitude</Table.HeadCell>
              <Table.HeadCell>Operational Timespan</Table.HeadCell>
              <Table.HeadCell>Mangers</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
            {landFill.map((land) => (
              <Table.Body className="divide-y" key={land._id}>
                <Table.Row className="bg-white  dark:border-gray-700 dark:bg-gray-800 text-center">
                  <Table.Cell>{land.name}</Table.Cell>
                  <Table.Cell>{land.capacity}</Table.Cell>
                  <Table.Cell>{land.gps_coordinates.latitude}</Table.Cell>
                  <Table.Cell>{land.gps_coordinates.longitude}</Table.Cell>
                  <Table.Cell>
                    {land.operationalTimespan.startTime}-
                    {land.operationalTimespan.endTime}
                  </Table.Cell>
                  <Table.Cell>{land.managers.length}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setName(land.name);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard?tab=manageLandfill&name=${land.name}`}>
                      Manage
                    </Link>
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
              Are you sure you want to delete this Landfill?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteLandfill}>
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

export default DashLandFill;
