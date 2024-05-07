import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle, HiPlus } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../apiConfig';
import AddNewRole from './AddNewRole';
import AddNewPermission from './AddNewPermission';

const DashRole = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleIdToDelete] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [permissionId, setPermissionIdToDelete] = useState(null);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [accessToken]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/rbac/roles`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data.data)
      
    } catch (error) {
      console.error("Errro fetching users", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/rbac/permissions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }
      const data = await response.json();
      setPermissions(data.data)
      
    } catch (error) {
      console.error("Errro fetching users", error);
    }
  };



  const handleDeleteRole = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rbac/roles/${roleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRoles((prev) => prev.filter((role) => role._id !== roleId));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete role: " + error.message);
    }
  };

  const handleDeletePermission = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rbac/permissions/${permissionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPermissions((prev) => prev.filter((permission) => permission._id !== permissionId));
        setShowModal(false);
      } else {
        console.log(data.message);
        
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

  const roleData = ["Admin", "STS Manager", "Landfill Manager"]


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto px-3 lg:py-3 pb-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      
      <h1 className='text-center font-bold text-lg py-2'>All Available Role</h1>
      {currentUser.isAdmin  ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>RoleName</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
           {roleData.map((role,index) => ( 
              <Table.Body className="divide-y" key={index}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                   03/05/2024
                  </Table.Cell>
                  <Table.Cell>
                    {role}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Link to={`/dashboard?tab=manageRole&roleName=${role}`} className='text-green-500'>
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
        <p>You have no roles yet!</p>
      )}
      
    </div>
  )
}

export default DashRole
