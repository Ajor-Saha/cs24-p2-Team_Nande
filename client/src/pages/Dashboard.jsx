import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../components/redux/user/userSlice";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/admin/DashSidebar";
import DashProfile from "../components/admin/DashProfile";
import DashUsers from "../components/admin/DashUsers";
import DashMange from "../components/admin/DashMange";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, accessToken } = useSelector(
    (state) => state.user
  ); // Access accessToken from the Redux store
  

  

  const location = useLocation();
  const [tab, setTab] = useState("");
  const [userId, setUserId] = useState(""); // State to store userId

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const userIdFromUrl = urlParams.get("userId"); // Extract userId from query parameter
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (userIdFromUrl) {
      setUserId(userIdFromUrl); // Set userId state if it exists in the query parameter
    }
  }, [location.search]);

 

  return (
    
      <div className="min-h-screen flex flex-col md:flex-row">
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/*All users */}
      {tab === 'users' && <DashUsers />}
      {/*mange user */}
      {tab === 'manageUser' && <DashMange userId={userId} />}
      
    </div>
    
  );
};

export default Dashboard;