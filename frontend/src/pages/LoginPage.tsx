import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

// Simple logo component
const Logo = () => (
  <div className="flex items-center space-x-2 text-2xl font-bold text-slate-900">
    <span>HIM</span>
  </div>
);

const LoginPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await handleLogin(username, password);
      if (success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const errorMessage =
        err.message && typeof err.message === "string"
          ? err.message
          : "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container with background image
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url('/login-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Logo */}
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      {/* Glassmorphism Login Card */}
      <div
        className="relative p-8 w-full max-w-sm rounded-3xl backdrop-blur-xl border border-white/50 shadow-2xl transition-all duration-300 transform"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 100px 0 rgba(100, 100, 255, 0.15)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-slate-600 text-sm">
            We're excited to see you again.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmitLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              username
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white/60 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-base shadow-sm transition-all"
                placeholder="Enter your username"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
             
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white/60 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-base shadow-sm transition-all"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Display */}
          {console.log("the following error happened", error)}
          {error && (
            <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
              <div className="flex items-start text-sm text-rose-800">
                <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                {error}
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-base shadow-lg hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Signing in...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
