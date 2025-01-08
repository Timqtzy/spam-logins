import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/SpamLogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(""); // success, error

  const showToastNotification = (message, type) => {
    setMessage(message);
    setToastType(type);
    setShowToast(true);
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login Successful!");
        showToastNotification("Login Successful!", "success");
        navigate("/dashboard");
      } else {
        showToastNotification("Invalid Email or Password!", "error");
      }
    } catch (error) {
      console.error("Error during login: ", error);
    }
  };

  return (
    <div>
      <div>
        <img
          src={Logo}
          className="w-48 sm:w-64 mx-auto pt-12 pb-6"
          alt="Spam Logo"
        />
        <h2 className="text-3xl font-bold pb-8  text-gray-900 dark:text-white">
          Login
        </h2>
      </div>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-start mb-5">
          <Link
            to={"ForgotPassword"}
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-blue-600 dark:text-gray-300 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="focus:outline-none w-full text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Login
        </button>
      </form>

      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-50 min-w-[300px] text-center ${
            toastType === "success"
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100"
          } p-4 rounded-lg shadow-lg border ${
            toastType === "success" ? "border-green-200" : "border-red-200"
          } animate-fade-in-up`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
