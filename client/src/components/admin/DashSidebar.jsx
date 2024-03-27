import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiChartPie, HiAnnotation } from "react-icons/hi";
import { FaChartArea } from "react-icons/fa6";
import { MdOutlineFireTruck } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { BASE_URL } from "../../apiConfig";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut =async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
        }, // Adjust the method as needed
        // Add any required headers or options
      });

      if (response.ok) {
        dispatch(signOut());
        navigate("/login")
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error) {
      console.log(error);
      // Optionally display an error message to the user
    }
  };


  return (
    <Sidebar className="w-full md:w-60">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
        {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=rolesandpermission">
              <Sidebar.Item
                active={tab === "rolesandpermission"}
                icon={RxAvatar}
                as="div"
              >
                RolesAndPermission
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=vehicle">
              <Sidebar.Item
                active={tab === "vehicle"}
                icon={MdOutlineFireTruck}
                as="div"
              >
                ManageVehicle
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=sts">
              <Sidebar.Item
                active={tab === "sts"}
                icon={FaChartArea}
                as="div"
              >
                ManageSTS
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight}
           className="cursor-pointer"
           onClick={handleSignOut}
           >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;