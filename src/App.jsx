import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Page/SignIn";
import SignUp from "./Page/SignUp";
import ForgotPassword from "./Page/ForgotPassword";
import { Toaster } from "react-hot-toast";
// Trang Home mẫu
const Home = () => (
  <h1 style={{ textAlign: "center", marginTop: "50px" }}>
    Welcome to Home Page 🎉
  </h1>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} /> {/* Trang sau login */}
        <Route path="/" element={<SignIn />} /> {/* Trang mặc định */}
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
