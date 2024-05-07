import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/utils/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import ResetPassword from "./pages/ResetPassword";
import VerifyAccount from "./pages/VerifyAccount";
import ConfirmOTP from "./pages/ConfirmOTP";
import ChangePassword from "./pages/ChangePassword";
import Footer from "./components/footer/Footer";

function App() {
  const {currentUser} = useSelector(state => state.user)

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {!currentUser && <Route path="/login" element={<Login />} />}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:email" element={<VerifyAccount />} />
        <Route path="/forget-password" element={<ResetPassword />} />
        <Route path="/confirmOTP/:email" element={<ConfirmOTP />} />
        <Route path="/change/:email" element={<ChangePassword />} />
        <Route element={<PrivateRoute /> }>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
