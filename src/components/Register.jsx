// Register Component with Tailwind CSS (components/Register.js)
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { UserContext } from "../context/AuthProvider";
import { ApplicationContext } from "../context/ApplicationContextProvider"
import Loader from "./Loader.jsx"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const { loading, setLoading}  =  useContext(ApplicationContext)
  const navigate = useNavigate();
   const { setUser, setAuthFlag } = useContext(UserContext);

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authAPI.register({
        name,
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Set auth header for future requests
      axios.defaults.headers.common["x-auth-token"] = res.data.token;
      setUser(res.data.user)
      localStorage.setItem("user", res.data.user);
      setAuthFlag(true)
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data.message || "Registration failed");
    }
  };
//min-h-screen
  return (
    <div className=" bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-md w-full space-y-8  p-10 rounded-xl bg-white shadow-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-pink-600">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start tracking your wedding expenses
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="-space-y-px grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">
                Confirm Password
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                minLength="6"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={password2}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-2 px-4 border border-transparent cursor-pointer text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none disabled:bg-pink-400"
            >
              {loading ? "Creating Account..." : "Register"}
              {loading && ( <Loader />)}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-pink-500 hover:text-pink-600"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
