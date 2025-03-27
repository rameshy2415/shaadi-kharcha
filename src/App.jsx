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
//import HeaderWithSidebar from "./components/HeaderWithSidebar"

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
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      </Router>
    </>
  );
}

export default App;
