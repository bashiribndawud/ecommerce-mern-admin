import React, { useState } from "react";
import { ImFacebook } from "react-icons/im";
import { AiOutlineGoogle } from "react-icons/ai";
import { AiFillGithub } from "react-icons/ai";
import { useFormik } from "formik";
import { loginValidation } from "../utils/validation";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET
console.log(clientId)

const Login = () => {
  const [isLogin, setIsLogin] = useState("login");
  const [loading, setLoading]  = useState(false)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const {
          data: { message },
          status,
        } = await axios.post(`/auth/${isLogin}`, { ...values });
        if (status === 201) {
          formik.resetForm();
          toast.success(message);
        }
      } catch (error) {
        if (error.response.status) {
          const {
            data: { message },
          } = error.response;
          toast.error(message);
        }
      }
    },
  });

  const handleGoogleLogin = async () => {
    window.open("http://localhost:9000/auth/google", "_self");
  };
  
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 4000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div className="flex flex-col md:flex-row md:p-8 gap-8 items-center justify-evenly bg-white w-[90%] h-[85%] md:w-[60%] shadow-xl rounded-xl">
        <div className="left flex flex-col items-center space-y-2 w-[90%] sm:w-[70%] py-2">
          <button
            className="p-4 w-[95%] bg-red-500 text-white rounded-xl flex items-center justify-center"
            onClick={handleGoogleLogin}
          >
            <AiOutlineGoogle className="mr-2 text-3xl" />
            <span className="font-bold">Google</span>
          </button>
          <button className="p-4 w-[95%] text-center bg-blue-800 text-white rounded-xl flex items-center justify-center">
            <ImFacebook className="mr-2 text-3xl" />
            <span className="font-bold">Facebook</span>
          </button>
          <button className="p-4 w-[95%] bg-black text-white rounded-xl flex items-center justify-center">
            <AiFillGithub className="mr-2 text-3xl" />
            <span className="font-bold">Github</span>
          </button>
        </div>
        <div className="right w-[90%] sm:w-[70%]">
          <form className="w-[100%]" onSubmit={formik.handleSubmit}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="block p-3 w-[100%] border rounded-md mb-2 focus:outline-none"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="block p-3 w-full rounded-md border mb-2 focus:outline-none"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <button
              type="submit"
              className="w-full p-2 bg-red-400 text-white rounded flex items-center justify-center"
            >
              {isLogin === "login" ? (
                "Login"
              ) : isLogin === "register" ? (
                "Register"
              ) : (
                <Loader />
              )}
            </button>
          </form>
          <div className="text-gray-500">
            Dont have an account?{" "}
            {isLogin === "register" ? (
              <button
                className="text-red-400 underline"
                type="button"
                onClick={() => setIsLogin("login")}
              >
                Login
              </button>
            ) : (
              <button
                className="text-red-400 underline"
                type="button"
                onClick={() => setIsLogin("register")}
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
