import axios from "axios";
import React, { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
const EditProduct = () => {
  const { id } = useParams();
   console.log(id);
  const [product, setProduct] = useState(null);
  const getProduct = async () => {
    const { data, status } = await axios.get("/product/edit", {
      params: { id },
    });
    if (status === 200) {
      setProduct(data);
      console.log(data);
    }
  };
  useEffect(() => {
    getProduct();
  }, [id]);

  return <ProductForm />;
};

export default EditProduct;
