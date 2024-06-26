import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../components/redux/user/userSlice";
import { BASE_URL } from "../apiConfig";
import { Button } from "flowbite-react";

const Login = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [message, setMessage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }

      if (!res.ok) {
        setMessage(true);
      }

      const { user, accessToken } = data.data; // Check if accessToken is present in the correct structure
      dispatch(signInSuccess({ user, accessToken }));
      setMessage(false);
      navigate("/dashboard");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="pt-32 lg:py-44 dark:bg-gray-900 min-h-screen">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://firebasestorage.googleapis.com/v0/b/e-commerce-f3116.appspot.com/o/dncc.webp?alt=media&token=c7456619-b967-40e8-a1d5-e5f8be9fa5b5')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            EcoSync
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              login with email
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                name="email"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500">
                  Forget Password?
                </a>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-8">
              <button
                disabled={loading}
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <Link to="/signup" className="text-xs text-gray-500 uppercase">
              or sign up
            </Link>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
          <Link to="/forget-password" className="font-semibold">
            forget password
          </Link>
          <p className="text-red-700">
            {error && "Email or password is wrong"}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center py-12 w-[500px] ml-24">
        <Link to="/workerLogin">
          <Button color="gray" pill>
            Login For Worker
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
