import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Page/Signin";
import SignUp from "./Page/SignUp";
import ForgotPassword from "./Page/ForgotPassword";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<SignIn />} /> {/* Trang mặc định */}
      </Routes>
    </Router>
  );
};

export default App;
