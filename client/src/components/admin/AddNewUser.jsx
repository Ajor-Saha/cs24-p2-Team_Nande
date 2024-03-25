import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";

const AddNewUser = () => {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }
  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>
        <HiPlus className="mr-2 h-5 w-5" />
        Add new user
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form action="">
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add new user to our platform
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="fullName" value="Full Name" />
                </div>
                <TextInput
                  id="fullName"
                  name="fullName"
                  placeholder="Jon Doe"
                  type="text"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Username" />
                </div>
                <TextInput
                  id="username"
                  name="username"
                  placeholder="john"
                  type="text"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput id="password" type="password" required />
              </div>

              <div className="w-full">
                <Button className="text-lg font-sans">Create User</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddNewUser;
