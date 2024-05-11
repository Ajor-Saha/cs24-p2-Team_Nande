import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";

const AddNewContractor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.user);

  function onCloseModal() {
    setOpenModal(false);
    setFormData({});
    setErrorMessage("");
    setSuccessMessage("");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/contractor/addContractor`, {
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
        setErrorMessage(data.message || "Failed to create Contractor");
      } else {
        setSuccessMessage(data.message || "Contractor created successfully");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create New Contractor.");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>
        <HiPlus className="mr-2 h-5 w-5" />
        Add New Contractor
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add new Contractor to our platform
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="companyName" value="Company Name" />
                </div>
                <TextInput
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Company Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="contractId" value="Contract ID" />
                </div>
                <TextInput
                  id="contractId"
                  name="contractId"
                  type="text"
                  placeholder="Contract ID"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="registrationDate" value="Registration Date" />
                </div>
                <TextInput
                  id="registrationDate"
                  name="registrationDate"
                  type="date"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="tin" value="TIN" />
                </div>
                <TextInput
                  id="tin"
                  name="tin"
                  type="Number"
                  placeholder="TIN"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="contactNumber" value="Contact Number" />
                </div>
                <TextInput
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  placeholder="Contact Number"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="workforceSize" value="Workforce Size" />
                </div>
                <TextInput
                  id="workforceSize"
                  name="workforceSize"
                  type="number"
                  placeholder="Workforce Size"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="paymentPerTonnage" value="Payment Per Tonnage" />
                </div>
                <TextInput
                  id="paymentPerTonnage"
                  name="paymentPerTonnage"
                  type="number"
                  placeholder="Payment Per Tonnage"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="requiredWastePerDay" value="Required Waste Per Day" />
                </div>
                <TextInput
                  id="requiredWastePerDay"
                  name="requiredWastePerDay"
                  type="number"
                  placeholder="Required Waste Per Day"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="contractDuration" value="Contract Duration" />
                </div>
                <TextInput
                  id="contractDuration"
                  name="contractDuration"
                  type="number"
                  placeholder="Contract Duration"
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
                  <Label htmlFor="designatedSTS" value="Designated STS" />
                </div>
                <TextInput
                  id="designatedSTS"
                  name="designatedSTS"
                  type="number"
                  placeholder="Designated STS"
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Add other fields as necessary */}
              <div className="w-full">
                <Button className="text-lg font-sans" type="submit">
                  {loading ? "Loading..." : "Add New Contractor"}
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

export default AddNewContractor;
