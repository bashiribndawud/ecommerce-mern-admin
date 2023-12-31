import { useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import LoginRegister from "./Pages/LoginRegister";
import Home from "./Pages/Home";
import axios from "axios";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Settings from "./Pages/Settings";
import NewProduct from "./Pages/NewProduct";
import EditProduct from "./Pages/EditProduct";
import { Categories } from "./Pages/Categories";

axios.defaults.baseURL = "http://localhost:9000";
axios.defaults.withCredentials = true;
axios.interceptors.request.use((req) => {
  if (localStorage.getItem("user_info")) {
    req.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("user_info").token
    )}`;
  }
  return req;
});

export const signIn = (data) => axios.post("/auth/login", data);
export const signInGoogle = (accessToken) =>
  axios.post("/auth/login", { googleAccessToken: accessToken });

// Sign up
export const signUp = (data) => axios.post("/auth/register", data);
export const signUpGoogle = (accessToken) =>
  axios.post("/auth/register", { googleAccessToken: accessToken });

function App() {
  const user = false;
  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<NewProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
          </Route>
          <Route exact path="/login" element={<LoginRegister />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
