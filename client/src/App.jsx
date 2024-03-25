import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/utils/PrivateRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoute /> }>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
