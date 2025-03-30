import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserContext } from "./context/AuthProvider";

import MarriageExpenseTracker from "./components/MarriageExpenseTracker";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer"
import AboutUs from "./components/AboutUs"
import ContactUs from "./components/ContactUs";
import EmailUs from "./components/EmailUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  /* console.log("Token", token);
  const user = localStorage.getItem("user");
  const { setAuthFlag, setUser } = useContext(UserContext);
  setUser(user);
  token ? setAuthFlag(true) : setAuthFlag(false); */
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/email" element={<EmailUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
        
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MarriageExpenseTracker />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Footer />
      </Router>
      </div>
    </>
  );
}

export default App;
