import React, { useState } from "react";
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

  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({});
  const navigate = useNavigate();
  const [loadingPass, setLoadingPass] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePassword = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Add 'e' as a parameter here
    e.preventDefault();
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
                    Your Name
                  </h6>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      defaultValue={currentUser.username}
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
                      defaultValue={currentUser.email}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={handleChange}
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
              <div className="flex text-red-500">
                <button>Delete</button>
              </div>
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
        <Alert type={passwordChangeMessage.includes("successfully") ? "success" : "error"} className="mt-4">
          {passwordChangeMessage}
        </Alert>
      )}
    </div>
  );
};

export default DashProfile;
