import React, { useState } from "react";
import Logo from "../assets/SpamLogo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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
    setError(""); // Reset error state
    setMessage(""); // Reset message state

    const data = { email };
    console.log("Data being sent:", data); // Check this in the console
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Response received:", result); // Log the response

      if (result.success) {
        showToastNotification("Password reset link sent to email!", "success");
      } else {
        showToastNotification(result.message, "error");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError("An error occurred while trying to send the reset link.");
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
          Forgot Password
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="email"
            className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
          >
            Your Email
          </label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="focus:outline-none max-w-sm w-full text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Send Reset Link
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

export default ForgotPassword;
