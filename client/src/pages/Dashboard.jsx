import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../components/redux/user/userSlice";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/admin/DashSidebar";
import DashProfile from "../components/admin/DashProfile";
import DashUsers from "../components/admin/DashUsers";
import DashMange from "../components/admin/DashMange";
import DashRole from "../components/admin/DashRole";
import DashRoleManage from "../components/admin/DashRoleManage";
import DashPermission from "../components/admin/DashPermission";
import DashVehicle from "../components/admin/DashVehicle";
import ManageVehicle from "../components/admin/ManageVehicle";
import DashSTS from "../components/sts/DashSTS";
import ManageSTS from "../components/sts/ManageSTS";
import DashLandFill from "../components/landfill/DashLandFill";
import ManageLandFill from "../components/landfill/ManageLandFill";
import ManagerSTS from "../components/sts/ManagerSTS";
import ManagerLandfill from "../components/landfill/ManagerLandfill";
import DashboardComp from "../components/admin/DashboardComp";
import DashManagerList from "../components/managers/DashManagerList";
import STSVehicle from "../components/sts/STSVehicle";
import VehicleLandFill from "../components/landfill/VehicleLandFill";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, accessToken } = useSelector(
    (state) => state.user
  ); // Access accessToken from the Redux store
  

  

  const location = useLocation();
  const [tab, setTab] = useState("");
  const [userId, setUserId] = useState(""); // State to store userId
  const [roleName, setRoleName] = useState("");
  const [vehicle_reg_number, setVehicle_reg_number] = useState("");
  const [ward_number, setWard_number] = useState("");
  const [landFill_name, setLandFill_name] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const userIdFromUrl = urlParams.get("userId");
    const roleNameFromUrl = urlParams.get("roleName"); 
    const vehicle_reg_numberFromUrl = urlParams.get("vehicle_reg_number");
    const ward_numberFromUrl = urlParams.get("ward_number")
    const landfillnameFromUrl = urlParams.get("name");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (userIdFromUrl) {
      setUserId(userIdFromUrl); // Set userId state if it exists in the query parameter
    }
    if (roleNameFromUrl) {
      setRoleName(roleNameFromUrl);
    }

    

    if (vehicle_reg_numberFromUrl) {
      setVehicle_reg_number(vehicle_reg_numberFromUrl)
    }
    if (ward_numberFromUrl) {
      setWard_number(ward_numberFromUrl)
    }
    
    if (landfillnameFromUrl) {
      setLandFill_name(landfillnameFromUrl)
    }
  }, [location.search]);



  return (
    
      <div className="min-h-screen flex flex-col md:flex-row">
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/*Dashboard */}
      {tab === 'dash' && <DashboardComp />}
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/*All users */}
      {tab === 'users' && <DashUsers />}
      {/*mange user */}
      {tab === 'manageUser' && <DashMange userId={userId} />}
      {/*mange roles and permission */}
      {tab === 'rolesandpermission' && <DashRole />}
      {/*mange roles */}
      {tab === 'manageRole' && <DashRoleManage roleName = {roleName}/>}
      
      { /* vehicle */}
      {tab === 'vehicle' && <DashVehicle />}
      {/*manage vehicle */}
      {tab === 'manageVehicle' && <ManageVehicle vehicle_reg_number={vehicle_reg_number} />}
      {/* sts */}
      {tab === 'sts' && <DashSTS />}
      {/*Manage sts */}
      {tab === 'manageSTS' && <ManageSTS ward_number={ward_number}/>}
      {/*Landfill*/}
      {tab === 'landfill' && <DashLandFill />}
      {tab === 'vehicleLandfill' && <VehicleLandFill />}
      {/*manage Landfill*/}
      {tab == 'manageLandfill' && <ManageLandFill landFill_name={landFill_name} />}
      {tab == 'userSTS' && <ManagerSTS />}
      {tab === 'stsVehicle' && <STSVehicle />}
      {tab == 'userLandfill' && <ManagerLandfill />}
      {tab == 'managers' && <DashManagerList />}
    </div>
    
  );
};

export default Dashboard;