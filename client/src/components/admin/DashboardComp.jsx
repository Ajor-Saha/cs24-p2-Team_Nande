import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";
import { Button, Progress, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../apiConfig";

const DashboardComp = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totallandfillWaste, setTotalLandfillWaste] = useState(0);
  const [stsDetails, setSTSDetails] = useState([]);
  const [allFuelCosts, setAllFuelCosts] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  useEffect(() => {
    fetchUsers();
    fetchLandFillWaste();
    fetchStsDetails();
    fetchfuelallocation();
    fetchTransportationActivites();
    fetchCountRole();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Errro fetching users", error);
    }
  };

  const fetchLandFillWaste = async () => {
    try {
      const response = await fetch(`${BASE_URL}/landfill/totalwaste`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total landfill waste");
      }
      const data = await response.json();
      setTotalLandfillWaste(data.data);
    } catch (error) {
      console.error("Errro fetching users", error);
    }
  };

  const fetchStsDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getallstswaste`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transportation details");
      }
      const data = await response.json();
      setSTSDetails(data.data);
    } catch (error) {
      console.error("Errro fetching transporation details", error);
    }
  };

  const fetchfuelallocation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/landfill/getallfuelcost`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fuel allocations details");
      }
      const data = await response.json();
      setAllFuelCosts(data.data);
    } catch (error) {
      console.error("Errro fetch fuel allocations details", error);
    }
  };

  const fetchCountRole = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rbac/rol`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fuel allocations details");
      }
      const data = await response.json();
      setUserRoles(data.data);
    } catch (error) {
      console.error("Errro fetch fuel allocations details", error);
    }
  };

  const fetchTransportationActivites = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getrecenttransportation`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fuel allocations details");
      }
      const data = await response.json();
      setTransportations(data.data);
    } catch (error) {
      console.error("Errro fetch fuel allocations details", error);
    }
  };

  //console.log(stsDetails);

  return (
    <div className="px-3 dark:bg-gray-900 py-6 lg:py-8 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
            </span>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Waste Collected by DNCC Landfill (Last Month)
              </h3>
              <p className="text-2xl">{totallandfillWaste} tons</p>
            </div>
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center"></span>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <h3 className="text-gray-500 text-md uppercase">
              User Count by role
            </h3>
          </div>
          <div>
            <p><span className="font-semibold">Admin:</span> {userRoles.adminCount}(person)</p>
            <p><span className="font-semibold">STS Manager:</span> {userRoles.stsManagerCount}(person)</p>
            <p><span className="font-semibold">LandFill Manager:</span> {userRoles.landfillManagerCount}(person)</p>
            <p><span className="font-semibold">Unassigned:</span> {userRoles.unassignedCount} (person)</p>
          </div>
        </div>
        <div>
          <h1 className="text-center text-lg font-semibold py-2">
            This month total waste collected by each sts
          </h1>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ward Number</Table.HeadCell>
              <Table.HeadCell>Capacity</Table.HeadCell>
              <Table.HeadCell>Total Waste Collected</Table.HeadCell>
            </Table.Head>
            {stsDetails.map((newsts) => (
              <Table.Body
                className="divide-y text-center"
                key={newsts.ward_number}
              >
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{newsts.ward_number}</Table.Cell>

                  <Table.Cell>{newsts.capacity}</Table.Cell>
                  <Table.Cell>{newsts.totalWaste}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div>
          <h1 className="text-center text-lg font-semibold py-2">
            Recent Fuel allocation cost for all vehicles
          </h1>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
              <Table.HeadCell>Weight of Waste</Table.HeadCell>
              <Table.HeadCell>Fuel Cost</Table.HeadCell>
            </Table.Head>
            {allFuelCosts.map((fuel_cost, index) => (
              <Table.Body className="divide-y text-center" key={index}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{fuel_cost.vehicle_reg_number}</Table.Cell>

                  <Table.Cell>{fuel_cost.weight_of_waste}</Table.Cell>
                  <Table.Cell>{fuel_cost.fuel_cost.toFixed(2)}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div>
          <h1 className="text-center text-lg font-semibold py-2">
            This Week Transportation Activites
          </h1>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Origin(ward_number)</Table.HeadCell>
              <Table.HeadCell>Destination</Table.HeadCell>
              <Table.HeadCell>Vehicle_reg_number</Table.HeadCell>
              <Table.HeadCell>Weight of Waste</Table.HeadCell>
            </Table.Head>
            {transportations.map((transport, index) => (
              <Table.Body className="divide-y text-center" key={index}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{transport.ward_number}</Table.Cell>

                  <Table.Cell>DNCC</Table.Cell>
                  <Table.Cell>{transport.vehicle_reg_number}</Table.Cell>
                  <Table.Cell>{transport.weight_of_waste}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
