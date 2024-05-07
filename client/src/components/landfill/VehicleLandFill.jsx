import { Button, Table } from 'flowbite-react'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../apiConfig';

const VehicleLandFill = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [stsEntries, setStsEntries] = useState([]);

  useEffect(() => {
    fetchStsEntries();
  }, []);

  const fetchStsEntries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sts/getallstsEntries`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LandFill");
      }

      const data = await response.json();
      setStsEntries(data.data);
    } catch (error) {
      console.error("Error fetching Landfills", error);
    }
  };

  
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className='flex flex-col justify-center items-center'>
      <Button color="light" pill className='text-lg font-semibold my-2'>
         All Waste and Vehicle Details coming from sts to this Landfill
      </Button>
      </div>
      <div>
      {currentUser.role === 'Landfill Manager' && stsEntries.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ward Number</Table.HeadCell>
              <Table.HeadCell>Vehicle Number</Table.HeadCell>
              <Table.HeadCell>Weight of Waste</Table.HeadCell>
              <Table.HeadCell>Distance Traveled</Table.HeadCell>
            </Table.Head>
            {stsEntries.map((sts) => (
              <Table.Body className="divide-y" key={sts._id}>
                <Table.Row className="bg-white  dark:border-gray-700 dark:bg-gray-800 text-center">
                  <Table.Cell>{sts.sts_id.ward_number}</Table.Cell>
                  <Table.Cell>{sts.vehicle_reg_number}</Table.Cell>
                  <Table.Cell>{sts.weight_of_waste}</Table.Cell>
                  <Table.Cell>{sts.distance_traveled}</Table.Cell>
                  
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>No More waste for landfill Entry!</p>
      )}
      </div>
    </div>
  )
}

export default VehicleLandFill
