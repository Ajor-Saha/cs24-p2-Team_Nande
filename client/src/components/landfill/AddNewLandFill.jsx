import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const AddNewLandFill = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, accessToken } = useSelector((state) => state.user);

  function onCloseModal() {
    setOpenModal(false);
    setFormData({});
    setErrorMessage("");
    setSuccessMessage("");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/landfill/addlandfill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Add accessToken to Authorization header
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create Landfill");
      } else {
        setSuccessMessage(data.message || "Landfill created successfully");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create vehicle.");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>
        <HiPlus className="mr-2 h-5 w-5" />
        Add New Landfill
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add new LandFill to our platform
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="LandFill Name" />
                </div>
                <TextInput
                  id="name"
                  name="name"
                  placeholder="DNCC"
                  type="text"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="capacity" value="Capacity" />
                </div>
                <TextInput
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="Capacity"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="latitude" value="Latitude" />
                </div>
                <TextInput
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="longitude" value="Longitude" />
                </div>
                <TextInput
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="startTime" value="Start Time" />
                </div>
                <TextInput
                  id="startTime"
                  name="startTime"
                  type="time"
                  placeholder="startTime"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="endTime" value="End Time" />
                </div>
                <TextInput
                  id="endTime"
                  name="endTime"
                  type="time"
                  placeholder="endTime"
                  onChange={handleChange}
                  required
                />
              </div>
               
              <div className="w-full">
                <Button className="text-lg font-sans" type="submit">
                  {loading ? "Loading..." : "Add New LandFill"}
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddNewLandFill;
