import { Button, Card, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../apiConfig";

const VerifyAccount = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: String(email), otp: Number(otp) }),
        // Convert email to string and otp to number format
      });

      if (response.ok) {
        // OTP verification successful
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError("Otp verifcation failed.");
      }
    } catch (error) {
      setError("Otp verifcation failed.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center py-32">
      <Card className="w-96">
        <h1 className="text-lg font-bold py-2 text-center">
          Verify Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="otp" value="Enter OTP" />
            </div>
            <TextInput
              id="otp"
              type="number"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            color="dark"
            type="submit"
            className="mt-5 w-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default VerifyAccount;
