import React, { useState, lazy, Suspense } from "react";
const ProductForm = lazy(() => import("../components/ProductForm"));
import Loader from "../components/Loader";
const NewProduct = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ProductForm />
    </Suspense>
  );
};

export default NewProduct;
