import { Button, Card, Label, Select, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../apiConfig';

const STSManagerContractor = () => {
  const { accessToken, currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stsDetails, setSTSDetails] = useState(null);
  const [stsEntryDetails, setSTSEntryDetails] = useState([]);
  const [contractorsDetails , setContractorDetails] = useState([]);

  const [formData, setFormData] = useState({
    timeAndDateOfCollection: '',
    amountOfWasteCollected: '',
    contractorID: '',
    typeOfWasteCollected: '',
    designatedSTSForDeposit: '',
    vehicleUsedForTransportation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await fetch(`${BASE_URL}/sts/addSTSEntryForContractor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      

      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to create sts entry");
      } else {
        setSuccessMessage(data.message || "Sts Entry Created Successfully");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to create STS entry.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };


  useEffect(() => {
    const userId = currentUser._id;
    const fetchSTS = async () => {
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
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
      }
    };

    if (userId) {
      fetchSTS();
    }
  }, [currentUser._id]);

  
  const fetchSTSEntryDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/sts/getstsEntryContractor/${stsDetails.ward_number}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSTSEntryDetails(data.data);
      } else {
        console.error("Failed to fetch user's STS:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user's STS:", error);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/sts/getcontractorByWard/${stsDetails.ward_number}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setContractorDetails(data.data);
      } else {
        console.error("Failed to fetch user's STS:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user's STS:", error);
    }
  };

  useEffect(() => {
    fetchSTSEntryDetails();
    fetchContractors();
  }, [stsDetails])

  

  const handleGeneratePDF = async (contractId) => {
    
    try {
      
      const response = await fetch(
        `${BASE_URL}/sts/generateBillForContractor/${contractId}`
      );
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      // Open the PDF in a new window
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage("Failed to generate PDF");
    }
    
  };


  return (
    <div className="overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div>
      <Card className="w-96 lg:w-[500px] mx-auto">
      <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new STS Entry
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="timeAndDateOfCollection" value="Time and Date of Collection" />
              </div>
              <TextInput
                id="timeAndDateOfCollection"
                name="timeAndDateOfCollection"
                type="datetime-local"
                value={formData.timeAndDateOfCollection}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="amountOfWasteCollected" value="Amount of Waste Collected" />
              </div>
              <TextInput
                id="amountOfWasteCollected"
                name="amountOfWasteCollected"
                type="number"
                value={formData.amountOfWasteCollected}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="contractorID" value="Contractor ID" />
              </div>
              <TextInput
                id="contractorID"
                name="contractorID"
                type="text"
                value={formData.contractorID}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="typeOfWasteCollected" value="Type of Waste Collected" />
              </div>
              <Select
                id="typeOfWasteCollected"
                name="typeOfWasteCollected"
                value={formData.typeOfWasteCollected}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Domestic">Domestic</option>
                <option value="Plastic">Plastic</option>
                <option value="Construction Waste">Construction Waste</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="designatedSTSForDeposit" value="Designated STS for Deposit" />
              </div>
              <TextInput
                id="designatedSTSForDeposit"
                name="designatedSTSForDeposit"
                type="number"
                value={formData.designatedSTSForDeposit}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="vehicleUsedForTransportation" value="Vehicle Used for Transportation" />
              </div>
              <TextInput
                id="vehicleUsedForTransportation"
                name="vehicleUsedForTransportation"
                type="number"
                value={formData.vehicleUsedForTransportation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <Button className="text-lg font-sans" type='submit'>
                Add STS Entry
              </Button>
            </div>
          </div>
        </form> 
        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
        </Card>
      </div>
      <div className="py-10">
        <h3 className="text-center text-gray-800 text-lg font-semibold py-2">
          Contractor to STS Entry List
        </h3>
        
        {contractorsDetails.map((contract) => (
          <Button color="gray" pill  className='my-5' onClick={() => handleGeneratePDF(contract.contractId)}>Generate Bil for {contract.companyName}</Button>
        ))}
        
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>timeAndDateOfCollection</Table.HeadCell>
            <Table.HeadCell>amountOfWasteCollected</Table.HeadCell>
            <Table.HeadCell>contractorID</Table.HeadCell>
            <Table.HeadCell>typeOfWasteCollected</Table.HeadCell>
            <Table.HeadCell>designatedSTSForDeposit</Table.HeadCell>
            <Table.HeadCell>vehicleUsedForTransportation</Table.HeadCell>
          </Table.Head>
          {stsEntryDetails.map((entry) => (
            <Table.Body className="divide-y" key={entry._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{entry.timeAndDateOfCollection}</Table.Cell>
                <Table.Cell>{entry.amountOfWasteCollected}</Table.Cell>
                <Table.Cell>{entry.contractorID}</Table.Cell>
                <Table.Cell>{entry.typeOfWasteCollected}</Table.Cell>
                <Table.Cell>{entry.designatedSTSForDeposit}</Table.Cell>
                <Table.Cell>{entry.vehicleUsedForTransportation}</Table.Cell>
                
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
    </div>
  )
}

export default STSManagerContractor
