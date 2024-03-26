import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const DashPermission = ({ permissionId }) => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [permission, setPermission] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchPermissionById = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/rbac/permissions/${permissionId}`,
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
        setPermission(permissionData.data);
        setFormData({
          name: permissionData.data.name,
          description: permissionData.data.description,
        });
      } catch (error) {
        console.error("Error fetching role details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (permissionId) {
      fetchPermissionById();
    }
  }, [permissionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!permission) {
    return <p>Permission not found</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/rbac/permissions/${permissionId}`, {
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
      const updatedPermission = await response.json();
      setPermission(updatedPermission.data);
      alert("Permission updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-5">
      <h1 className="text-center text-lg font-bold pt-2">
        Update Permission details
      </h1>
      <form
         onSubmit={handleUpdatePermission}
        className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
      >
        <div className="flex flex-col gap-6 mb-1">
          <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
            Permission Name
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
            Permission Description
          </h6>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              id="description"
              name="description"
              type="text"
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            disabled={loading}
        >
           {loading ? "Loading..." : "Update Permission"} 
          Permission
        </button>
      </form>
    </div>
  );
};

export default DashPermission;
