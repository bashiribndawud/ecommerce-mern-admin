import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const getProducts = async () => {
      const { data, status } = await axios.get("/product/all");
      if (status === 200) {
        setProducts(data);
      }
    };
    getProducts();
  }, [isOpen]);
  return (
    <>
      <div className="p-2">
        <Link
          to={"/products/new"}
          className="bg-blue-500 text-white px-3 py-2 rounded-xl"
        >
          Add New Product
        </Link>
        <table>
          <thead>
            <tr>
              <td>S/N</td>
              <td>Product Name</td>
              <td>Price</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td className="w-[13rem] inline-flex">
                  <Link
                    className="bg-yellow-400 px-4 py-2 text-white  rounded inline-flex"
                    to={`/products/edit/${product._id}`}
                  >
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    className="bg-red-500 px-4 py-2 text-white ml-2  rounded inline-flex"
                    onClick={openModal}
                  >
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </Link>
                </td>
                <Modal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  closeModal={closeModal}
                  name={product.name}
                  id={product._id}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Products;
