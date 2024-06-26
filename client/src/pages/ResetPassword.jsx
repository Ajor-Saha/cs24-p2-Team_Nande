import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../apiConfig";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/auth/reset-password/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setLoading(false);
        // Reset password request successful
        const { email } = formData;
        navigate(`/confirmOTP/${email}`);
      } else {
        setError("Invalid email or user not found")
        setLoading(false);
      }
    } catch (error) {
      setError("Invalid request");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <h1 className="font-semibold text-xl">Reset your password</h1>
      <form
        className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-6 mb-1">
          <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
            Enter your email
          </h6>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@gmail.com"
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              onChange={handleChange}
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mt-6 block w-full select-none rounded-lg bg-gray-900 dark:bg-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="submit"
          disabled={loading}
        >
          { loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
