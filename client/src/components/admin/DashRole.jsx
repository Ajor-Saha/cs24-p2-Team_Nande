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




  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      
      <div className="flex justify-center items-center py-1 mb-1">
        <AddNewRole />
      </div>
      {currentUser.isAdmin && roles.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>RoleName</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
           {roles.map((role) => ( 
              <Table.Body className="divide-y" key={role._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                  {new Date(role.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {role.name}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Link to={`/dashboard?tab=manageRole&roleId=${role._id}`}>
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
              Are you sure you want to delete this role?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteRole} >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className='py-5'>
       <div className='flex justify-center items-center'>
       <AddNewPermission />
       </div>
      {currentUser.isAdmin && permissions.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>PermissionName</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Manage</Table.HeadCell>
            </Table.Head>
           {permissions.map((permission) => ( 
              <Table.Body className="divide-y" key={permission._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                  {new Date(permission.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {permission.name}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPermissionIdToDelete(permission._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard?tab=managePermission&permissionId=${permission._id}`}>
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
        <p>You have no permissions yet!</p>
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
              Are you sure you want to delete this Permission?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePermission} >
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
    </div>
  )
}

export default DashRole
