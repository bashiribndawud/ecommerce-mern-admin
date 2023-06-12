import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import Nav from "./Nav";
import Header from "./Header";
const Layout = () => {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    const getUser = async () => {
      const { status, data } = await axios.get("/auth/login/success", {
        withCredentials: true,
      });
      if (status === 200) {
        setUser(data.user);
      }
    };
    
    getUser();
    
  }, []);
  // if(!user){
  //     return <Navigate to={"/login"} />
  // }
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Nav showNav={showNav} setShowNav={setShowNav} />
      <div className="flex-grow">
        <div className="block md:hidden">
          <button onClick={() => setShowNav(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </button>
        </div>
        <Header />

        <div className="w-[97%] h-[90%] ml-5 bg-white rounded-lg p-4 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
// i2hNB4 ^ e;
export default Layout;
