import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../apiConfig";
import { signOut } from "../redux/user/userSlice";

const Header = () => {
    const { currentUser, loading, error, accessToken } = useSelector(
        (state) => state.user
      );
    const dispatch = useDispatch();

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
          } else {
            throw new Error("Failed to sign out");
          }
        } catch (error) {
          console.log(error);
          // Optionally display an error message to the user
        }
    };
   
  return (
    <div className="navbar bg-gray-100  px-5 lg:px-10">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">EcoSync</Link>
      </div>
      <div className="flex-none gap-5">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        {currentUser ? (
          // If user is logged in, render the dropdown menu
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile Picture"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/dashboard" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a
                onClick={handleSignOut}
                >Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          // If user is not logged in, render a login button
          <Link to="/login" className="btn btn-ghost text-lg">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
