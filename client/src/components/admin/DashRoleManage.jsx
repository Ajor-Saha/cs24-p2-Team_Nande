import { Button, Card, Label, ListGroup, Select, Table, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";
import { useParams } from "react-router-dom";

const DashRoleManage = ({ roleName }) => {
 
  const adminData = {
    title: "Admin",
    description: "Admins wield ultimate authority, possessing unrestricted access and oversight across the system. They manage users, STS, and landfills, ensuring comprehensive control and supervision over all aspects of the system.",
    fields: [
      { title: "Manage User"},
      { title: "Manage STS"},
      { title: "Manage Landfill"},
      { title: "Manage Vehicles"},
      { title: "Manage Roles and Permission"},
      // Add more fields as needed
    ],
  };
  const stsManagerData = {
    title: "STS Manager",
    description: "STS managers hold specialized authority over STS management, including STS entry and related functions. They oversee operations specific to STS facilities, ensuring efficient management and functionality within their designated scope.",
    fields: [
      { title: "See STS Details"},
      { title: "See Vehicles List of STS"},
      { title: "STS Entry"},
      { title: "Find Opitimzed Route STS to Landfill"},
      // Add more fields as needed
    ],
  };

  const landfillManagerData = {
    title: "Landfill Manager",
    description: "Landfill managers possess specialized access, primarily focused on managing landfills, including tasks like landfill entry management and related responsibilities.",
    fields: [
      { title: "See Landfill Details"},
      { title: "See all Sts Entries coming to this Landfill"},
      { title: "Landfill Entry"},
      // Add more fields as needed
    ],
  };
  
  const getRoleData = () => {
    switch (roleName) {
      case "Admin":
        return adminData;
      case "STS Manager":
        return stsManagerData;
      case "Landfill Manager":
        return landfillManagerData;
      default:
        return null;
    }
  };

  const roleData = getRoleData();

  if (!roleData) {
    return <div>Role not found</div>;
  }
  

  return (
    <div className="overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-xl text-center py-2 font-bold">See Roles and Permission Details</h1>
      <div>
        <Card className="w-96">
        <h2 className="text-lg font-semibold">RoleName: {roleData.title}</h2>
        <p><span className="text-lg font-semibold">Role Description:</span> <span className="">{roleData.description}</span></p>
        </Card>
        
        <div className="mt-4">
          <h1 className="text-lg font-semibold text-center py-2">Permissions of {roleName}</h1>
          {roleData.fields.map((field, index) => (
            <div key={index} className="flex justify-center">
              <ListGroup className="w-96">
                <ListGroup.Item>{field.title}</ListGroup.Item>
              </ListGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashRoleManage;
