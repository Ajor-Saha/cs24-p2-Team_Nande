import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
  HiAnnotation,
} from "react-icons/hi";
import { GrUserManager } from "react-icons/gr";
import { FaChartArea } from "react-icons/fa6";
import { MdOutlineFireTruck } from "react-icons/md";
import { GiIsland, GiMineTruck } from "react-icons/gi";
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
  const [stsDetails, setSTSDetails] = useState(null);
  const [isstsManager, setStsManager] = useState(false);
  const [landFillDetails, setLandFillDetails] = useState({});
  const [isLandfillManager, setLandfillManager] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
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
        navigate("/login");
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error) {
      console.log(error);
      // Optionally display an error message to the user
    }
  };

  if (currentUser.role === "STS Manager") {
    useEffect(() => {
      const userId = currentUser._id;
      const fetchSTS = async () => {
        setStsManager(false);
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
            setStsManager(true);
          } else {
            console.error("Failed to fetch user's STS:", data.message);
          }
        } catch (error) {
          console.error("Error fetching user's STS:", error);
          setStsManager(false);
        }
      };

      if (userId) {
        fetchSTS();
      }
    }, [currentUser._id]);
  }

  if (currentUser.role === "Landfill Manager") {
    useEffect(() => {
      const userId = currentUser._id;
      const fetchLandFill = async () => {
        setLandfillManager(false);
        try {
          const response = await fetch(
            `${BASE_URL}/landfill/finduserlandfill/${userId}`,
            {
              method: "GET",
            }
          );
          const data = await response.json();
          if (response.ok) {
            setLandFillDetails(data.data);
            setLandfillManager(true);
          } else {
            console.error("Failed to fetch user's STS:", data.message);
          }
        } catch (error) {
          console.error("Error fetching user's STS:", error);
          setLandfillManager(false);
        }
      };

      if (userId) {
        fetchLandFill();
      }
    }, [currentUser._id]);
  }

  return (
    <Sidebar className="w-full md:w-60 min-h-screen">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
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
            <Link to="/dashboard?tab=managers">
              <Sidebar.Item
                active={tab === "managers"}
                icon={GrUserManager}
                as="div"
              >
                Managers List
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
              <Sidebar.Item active={tab === "sts"} icon={FaChartArea} as="div">
                ManageSTS
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=landfill">
              <Sidebar.Item
                active={tab === "landfill"}
                icon={GiIsland}
                as="div"
              >
                ManageLandFill
              </Sidebar.Item>
            </Link>
          )}
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

          {currentUser.role === "STS Manager" && (
            <Link to="/dashboard?tab=userSTS">
              <Sidebar.Item
                active={tab === "userSTS"}
                icon={FaChartArea}
                as="div"
              >
                ManageSTS
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role === "STS Manager" && (
            <Link to="/dashboard?tab=stsVehicle">
              <Sidebar.Item
                active={tab === "stsVehicle"}
                icon={GiMineTruck}
                as="div"
              >
                Manage Vehicle
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role === "Landfill Manager" && (
            <Link to="/dashboard?tab=userLandfill">
              <Sidebar.Item
                active={tab === "userLandfill"}
                icon={GiIsland}
                as="div"
              >
                ManageLandFill
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role === "Landfill Manager" && (
            <Link to="/dashboard?tab=vehicleLandfill">
              <Sidebar.Item
                active={tab === "vehicleLandfill"}
                icon={GiMineTruck}
                as="div"
              >
                Waste and Vehicle 
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
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
