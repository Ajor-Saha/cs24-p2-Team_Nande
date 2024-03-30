import React from "react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp"
import { useSelector } from "react-redux";

const Hero = () => {

 const {currentUser} = useSelector(state => state.user)

  return (
    <div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Hello there</h1>
      <p className="py-6 font-semibold">Welcome to EcoSync: Empowering DNCC's waste management ecosystem. A unified platform for System Admins, Landfill Managers, and STS Managers to streamline operations. </p>
      <button className="btn btn-primary">
        <Link to="/login">Get Started</Link>
      </button>
    </div>
  </div>
</div>
  );
};

export default Hero;
