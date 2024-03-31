import { Button, Label, Select, Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const DashRoleManage = ({ roleId }) => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [role, setRole] = useState({});
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchRoleById = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/rbac/roles/${roleId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch role details");
        }
        const roleData = await response.json();
        setRole(roleData.data);
        setFormData({
          name: roleData.data.name,
          description: roleData.data.description,
        });
      } catch (error) {
        console.error("Error fetching role details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/rbac/roles/${roleId}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch role details");
        }
        const permissionData = await response.json();
        setPermissions(permissionData.data);
      } catch (error) {
        console.error("Error fetching role details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchRoleById();
      fetchPermissions();
    }
  }, [roleId]);

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rbac/permissions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }
        const data = await response.json();
        setAllPermissions(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPermissions();
  }, []);

  useEffect(() => {
    // Filter out permissions that are not present in the permissions array
    const filtered = allPermissions.filter(
      (permission) => !permissions.find((p) => p._id === permission._id)
    );
    setFilteredPermissions(filtered);
  }, [permissions, allPermissions]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!role) {
    return <p>Role not found</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

   const handleAddPermission = async (permissionName) => {
    
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/rbac/roles/${roleId}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ permission: permissionName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add permission to role");
      }
      const data = await response.json();
  
      const newPermissions = [];
  
      for (const permissionId of data.data.permissions) {
        const permissionResponse = await fetch(`${BASE_URL}/rbac/permissions/${permissionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!permissionResponse.ok) {
          throw new Error(`Failed to fetch permission details for ID: ${permissionId}`);
        }
        const permissionData = await permissionResponse.json();
        newPermissions.push(permissionData.data);
      }
  
      // Update the permissions array with the new permissions
      setPermissions((prevPermissions) => [...prevPermissions, ...newPermissions]);
    } catch (error) {
      console.error("Error adding permission to role:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg text-center py-2">Manage and Update Role</h1>
      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title={role.name} icon={HiUserCircle}>
            <div>
              <form className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96">
                <div className="flex flex-col gap-6 mb-1">
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    RoleName
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Role description
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
              </form>
            </div>
          </Tabs.Item>
          <Tabs.Item title="AddPermission" icon={HiPlus}>
            <h3 className="text-center">Add new Permission to this role</h3>
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Permission Name</Table.HeadCell>
                  <Table.HeadCell>Add this Permission</Table.HeadCell>
                </Table.Head>
                {filteredPermissions.map((permission, index) => (
                  <Table.Body className="divide-y" key={index}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{permission.name}</Table.Cell>
                      <Table.Cell>
                        <Button  onClick={() => handleAddPermission(permission.name)}>
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
        <div className="mt-10">
            <h1>This role have these following permissions</h1>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Permission Name</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {permissions.map((permission, index) => (
                <Table.Body className="divide-y" key={permission._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{permission.name}</Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-red-500 hover:underline cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          
        </div>
      </div>
    </div>
  );
};

export default DashRoleManage;
