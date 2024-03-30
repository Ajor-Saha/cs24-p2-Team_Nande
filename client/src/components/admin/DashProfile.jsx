import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Tabs, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateFailure, updateStart } from "../redux/user/userSlice";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { BASE_URL } from "../../apiConfig";

const DashProfile = () => {
  const { currentUser, error, loading, accessToken } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({});
  const navigate = useNavigate();
  const [loadingPass, setLoadingPass] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const dispatch = useDispatch();
  const [stsDetails, setSTSDetails] = useState(null);
  const [isstsManager, setStsManager] = useState(false);
  const [landFillDetails, setLandFillDetails] = useState({});
  const [isLandfillManager, setLandfillManager] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const [loadingData, setLoadingData] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePassword = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Add 'e' as a parameter here
    e.preventDefault();
    try {
      setLoadingData(true);
      
      const response = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile details');
      }
      setLoadingData(false);
      
      
    } catch (error) {
      console.error('Error updating profile details:', error);
      
      // Handle error state or display error message to the user
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setLoadingPass(true);
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      // If successful, set loadingPass to false and display success message
      setLoadingPass(false);
      setPasswordChangeMessage("Password changed successfully");
    } catch (error) {
      console.log("error is", error);
      // If failed, set loadingPass to false and display failure message
      setLoadingPass(false);
      setPasswordChangeMessage("Failed to change password");
    }
  };

  useEffect(() => {
    const userId = currentUser._id;
    const fetchSTS = async () => {
      setStsManager(false);
      try {
        const response = await fetch(
          `${BASE_URL}/sts/userstsdetails/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSTSDetails(data.data);
          setStsManager(true);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
        setStsManager(false);
      }
    };

    if (userId) {
      fetchSTS();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const userId = currentUser._id;
    const fetchLandFill = async () => {
      setLandfillManager(false);
      try {
        const response = await fetch(
          `${BASE_URL}/landfill/finduserlandfill/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLandFillDetails(data.data);
          setLandfillManager(true);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
        setLandfillManager(false);
      }
    };

    if (userId) {
      fetchLandFill();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const userId = currentUser._id;
    const fetchSTS = async () => {
      setStsManager(false);
      try {
        const response = await fetch(
          `${BASE_URL}/sts/userstsdetails/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSTSDetails(data.data);
          setStsManager(true);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
        setStsManager(false);
      }
    };

    if (userId) {
      fetchSTS();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfileDetails(data.data);
          setFormData({
            fullName: data.data.fullName || '',
            username: data.data.username || '',
            email: data.data.email || '',
          });
        } else {
          console.error(
            "Failed to fetch current user's details:",
            data.message
          );
        }
      } catch (error) {
        console.error("Error fetching current user details:", error);
      }
    };

    fetchProfileDetails();
  }, []);

  return (
    <div className="relative py-14  mx-auto flex flex-col text-gray-700 dark:text-gray-200 bg-transparent shadow-none rounded-xl bg-clip-border">
      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item active title="Profile" icon={HiUserCircle}>
            <div>
              <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                Profile
              </h4>
              <p className="block mt-1 pb-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700 dark:text-gray-200">
                Nice to meet you!
              </p>

              <form
                className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-6 mb-1">
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Your Full Name
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Your  UserName
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handleChange}
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Your Email
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit"
                  disabled={loading}
                >
                  {loadingData ? "Loading..." : "Update"}
                </button>
              </form>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Password" icon={MdDashboard}>
            <div>
              <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                Change Password
              </h4>

              <form
                className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
                onSubmit={changePassword}
              >
                <div className="flex flex-col gap-6 mb-1">
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Old Password
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handlePassword}
                      placeholder="....."
                    />
                  </div>
                  <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    New Password
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="peer font-semibold h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm  text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handlePassword}
                      placeholder="....."
                    />
                  </div>
                </div>
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  disabled={loading}
                >
                  {loadingPass ? "Loading..." : "Update"}
                </button>
              </form>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>

      <p className="text-red-700">
        {error ? error.message || "Something went wrong!" : ""}
      </p>
      {passwordChangeMessage && (
        <Alert
          type={
            passwordChangeMessage.includes("successfully") ? "success" : "error"
          }
          className="mt-4"
        >
          {passwordChangeMessage}
        </Alert>
      )}
      <div className="py-5">
        {isstsManager && (
          <div>
            <p>STS Managers Details</p>
            <p>You are STS manager</p>
            <p>Ward number : {stsDetails?.ward_number}</p>
            <p>
              Total Manager assigned to this sts is :{" "}
              {stsDetails.managers.length}
            </p>
            <div>
              <p>
                Total Vehicle assigned to this sts is:{" "}
                {stsDetails.vehicles.length}
              </p>
              {stsDetails.vehicles.map((vehicle, index) => (
                <div key={index}>
                  {/* Render vehicle details here */}
                  <p>Vehicle Registration Number: {vehicle}</p>
                  {/* Add more vehicle details as needed */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {isLandfillManager && (
          <div>
            <div>
              <p>LandFill Managers Details</p>
              <p>You are LandFill manager</p>
              <p>Landfill Name : {landFillDetails.name}</p>
              <p>Landfill Capacity: {landFillDetails.capacity}</p>
              <p>
                Total Manager assigned to this sts is :{" "}
                {landFillDetails.manager.length}
              </p>
              <p>
                OperationTimespan of this LandFill:
                {landFillDetails.operationalTimespan?.startTime}-
                {landFillDetails.operationalTimespan?.endTime}
              </p>
            </div>
          </div>
        )}
      </div>
      {!isstsManager && !isLandfillManager && !currentUser.isAdmin && (
        <p>Not assigned</p>
      )}
      {currentUser.isAdmin && (
        <p className="font-bold text-lg">This user is Admin</p>
      )}
    </div>
  );
};

export default DashProfile;
