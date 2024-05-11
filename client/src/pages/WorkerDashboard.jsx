import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../apiConfig";
import { signOut } from "../components/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    logInTime: "",
    logOutTime: "",
  });

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/workerLogout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
        }, // Adjust the method as needed
        // Add any required headers or options
      });

      if (response.ok) {
        dispatch(signOut());
        navigate("/workerLogin");
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error) {
      console.log(error);
      // Optionally display an error message to the user
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/worker/addWorkHour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create working hour");
      } else {
        setSuccessMessage(data.message || "Working hour created successfully");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create New Working Hour.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Card className="lg:w-[500px] w-[450px] p-6">
        <h1 className="text-center mb-4 text-lg font-bold">Worker Dashboard</h1>
        <div>
          <p>
            <strong>Full Name:</strong> {currentUser.fullName}
          </p>
        </div>
        <div>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
        </div>
        <div>
          <p>
            <strong>Employee ID:</strong> {currentUser.employeeId}
          </p>
        </div>
        <div>
          <p>
            <strong>Role:</strong> {currentUser.role}
          </p>
        </div>
        <div>
          <p>
            <strong>Phone Number:</strong> {currentUser.phoneNumber}
          </p>
        </div>
        <div>
          <p>
            <strong>Contractor Company:</strong> {currentUser.contractorCompany}
          </p>
        </div>
        <div>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(currentUser.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p>
            <strong>Date of Hire:</strong>{" "}
            {new Date(currentUser.dateOfHire).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p>
            <strong>Job Title:</strong> {currentUser.jobTitle}
          </p>
        </div>
        <div>
          <p>
            <strong>Payment Rate Per Hour:</strong>{" "}
            {currentUser.paymentRatePerHour}
          </p>
        </div>
      </Card>
      <div className="py-5 text-xl text-red-400">
        <Button color="warning" pill className="px-5" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
      <div>
        <Card className="w-96 lg:w-[500px]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add Working Hour
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="employeeId" value="Employee ID" />
                </div>
                <TextInput
                  id="employeeId"
                  name="employeeId"
                  placeholder="Enter Employee ID"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="date" value="Date" />
                </div>
                <TextInput
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="logInTime" value="Log In Time" />
                </div>
                <TextInput
                  id="logInTime"
                  name="logInTime"
                  type="time"
                  value={formData.logInTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="logOutTime" value="Log Out Time" />
                </div>
                <TextInput
                  id="logOutTime"
                  name="logOutTime"
                  type="time"
                  value={formData.logOutTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <Button
                  className="text-lg font-sans"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Add Work Hour"}
                </Button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
