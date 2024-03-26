import { Button, Label, Select, Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const DashMange = ({ userId }) => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });


  const fetchCurrentUserRole = async (roleId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/rbac/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch currentUser role");
      }
      const currentroleData = await response.json();
      setCurrentRole(currentroleData.data);
      
    } catch (error) {
      console.error("Error fetching current role", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await response.json();
        setUser(userData.data);
        setFormData({
          fullName: userData.data.fullName,
          username: userData.data.username,
          email: userData.data.email,
        });

        fetchCurrentUserRole(userData.data.role);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/rbac/roles`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const rolesData = await response.json();
        setRoles(rolesData.data);
        
      } catch (error) {
        console.error("Error fetching all roles", error);
      } finally {
        setLoading(false);
      }
    };

    
    

    if (userId) {
      fetchUserById();
      fetchUserRoles();
    }
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();
      setUser(updatedUser.data);
      setRoleId(updatedUser.data.role);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (name) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/${userId}/roles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: name }),
      });
      if (!response.ok) {
        throw new Error("Failed to change user role");
      }
      const updatedUser = await response.json();
      setUser(updatedUser.data);
      alert("User role updated successfully");
      fetchCurrentUserRole(updatedUser.data.role);
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Failed to change user role");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-lg text-center py-2">Manage and Update user</h1>
      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title="Profile" icon={HiUserCircle}>
            <div>
              <form
                onSubmit={handleUpdateUser}
                className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
              >
                <div className="flex flex-col gap-6 mb-1">
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    User FullName
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    User username
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    User Email
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Update user"}
                </button>
              </form>
            </div>
          </Tabs.Item>
          <Tabs.Item title="UserRole" icon={MdDashboard}>
            <div className="gap-10">
              <h3 className="py-5 text-center">Current user role: <b>{currentRole.name}</b></h3>
              <div>
                <h1 className="text-lg font-semibold text-center">Change User Role</h1>
                <div>
                  <Table hoverable className="shadow-md">
                    <Table.Head>
                      <Table.HeadCell>Date created</Table.HeadCell>
                      <Table.HeadCell>RoleName</Table.HeadCell>
                      <Table.HeadCell>Assign</Table.HeadCell>
                    </Table.Head>
                    {roles.map((role) => (  
                    <Table.Body className="divide-y" key={role._id} >
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                        {new Date(role.createdAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          {role.name}
                        </Table.Cell>
                       
                        <Table.Cell>
                          <Button
                            onClick={() => handleChangeRole(role.name)}
                          >
                            Change
                          </Button>{" "}
                          {/* Manage field */}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                   ))} 
                  </Table>
                </div>
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default DashMange;
