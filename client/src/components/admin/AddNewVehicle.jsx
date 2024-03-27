import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const AddNewVehicle = () => {
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
    if (e.target.id === "type") {
      setFormData({ ...formData, type: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/vehicle/addvehicle`, {
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
        setErrorMessage(data.message || "Failed to create vehicle.");
      } else {
        setSuccessMessage(data.message || "Vehicle created successfully.");
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
        Add new vehicle
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add new vehicle to our platform
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="vehicle_reg_number"
                    value="Vehicle_reg_number"
                  />
                </div>
                <TextInput
                  id="vehicle_reg_number"
                  name="vehicle_reg_number"
                  placeholder="1,2.."
                  type="number"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="type" value="Select vehicle type" />
                </div>
                <Select id="type" required onChange={handleChange}>
                  <option value="Open Truck">Open Truck</option>
                  <option value="Dump Truck">Dump Truck</option>
                  <option value="Compactor">Compactor</option>
                  <option value="Container Carrier">Container Carrier</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="capacity" value="capacity" />
                </div>
                <TextInput
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="3,5,7"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="fuel_cost_loaded" value="fuel_cost_loaded" />
                </div>
                <TextInput
                  id="fuel_cost_loaded"
                  name="fuel_cost_loaded"
                  type="number"
                  placeholder="10,15,20"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="fuel_cost_unloaded"
                    value="fuel_cost_unloaded"
                  />
                </div>
                <TextInput
                  id="fuel_cost_unloaded"
                  name="fuel_cost_unloaded"
                  type="number"
                  placeholder="10,15,20"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full">
                <Button className="text-lg font-sans" type="submit">
                  {loading ? "Loading..." : "Add New Vehicle"}
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

export default AddNewVehicle;
