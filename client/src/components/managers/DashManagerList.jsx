import { Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const DashManagerList = () => {
  const [stsManagers, setStsManagers] = useState([]);
  const [landfillManagers, setLandfillManagers] = useState([]);
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [unassignedUser, setUnassignedUser] = useState([]);

  useEffect(() => {
    fetchSTSManagers();
    fetchLandfillManagers();
    fetchUnassignedUsers();
  }, [accessToken]);

  const fetchSTSManagers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/user/sts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setStsManagers(data.data);
    } catch (error) {
      console.error("Errro fetching vehicles", error);
    }
  };

  const fetchLandfillManagers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/user/landfill`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setLandfillManagers(data.data);
    } catch (error) {
      console.error("Errro fetching vehicles", error);
    }
  };

  const fetchUnassignedUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/user/unassigned`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setUnassignedUser(data.data);
    } catch (error) {
      console.error("Errro fetching vehicles", error);
    }
  };

  //console.log(landfillManagers);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg font-bold text-center py-2">Managers List</h1>
      <Tabs aria-label="Full width tabs" style="fullWidth">
        <Tabs.Item active title="STS Managers" icon={GrUserManager}>
          <div>
            {currentUser.isAdmin && stsManagers.length > 0 ? (
              <>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Full Name</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Ward Number(STS)</Table.HeadCell>
                  </Table.Head>
                  {stsManagers.map((sts, index) => (
                    <Table.Body className="divide-y" key={index}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{sts.fullName}</Table.Cell>
                        <Table.Cell>{sts.email}</Table.Cell>

                        <Table.Cell>{sts.ward_number}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </>
            ) : (
              <p>You have no sts assigned with ward number yet!</p>
            )}
          </div>
        </Tabs.Item>
        <Tabs.Item title="LandFill Manager" icon={GrUserManager}>
          <div>
            {landfillManagers.map((landfill, index) => (
              <div key={index}>
                <h1 className="text-center py-2 font-semibold"> Landfill Name: {landfill.name}</h1>

                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Full Name</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                  </Table.Head>
                  {landfill.managers.map((land, index) => (
                    <Table.Body className="divide-y" key={index}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{land.fullName}</Table.Cell>
                        <Table.Cell>{land.email}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            ))}
          </div>
        </Tabs.Item>
        <Tabs.Item title="UnAssigned User" icon={ImProfile}>
          <div>
          {currentUser.isAdmin && unassignedUser.length > 0 ? (
              <>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Full Name</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                  </Table.Head>
                  {unassignedUser.map((unassined, index) => (
                    <Table.Body className="divide-y" key={index}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{unassined.fullName}</Table.Cell>
                        <Table.Cell>{unassined.email}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </>
            ) : (
              <p>You have  unassigned user yet!</p>
            )}
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default DashManagerList;
