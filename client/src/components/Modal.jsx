import React, { useState } from "react";
import Model from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Modal = ({ isOpen, closeModal, name, id, setIsOpen }) => {
  const navigate = useNavigate();
  async function deleteProduct(e) {
    e.preventDefault();
    const { status } = await axios.delete(`/product/delete/${id}`);
    if (status === 200) {
      setIsOpen(false)
    }
  }
  return (
    <div>
      <Model
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="w-[50%] h-[40%] mx-auto my-24 bg-white shadow-xl rounded-lg"
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h2 className="font-bold text-xl text-gray-500">
            Are You Sure You Want To Delete This Product
          </h2>
          <p className="text-xl py-2">{name}</p>
          <div>
            <button
              onClick={closeModal}
              className="bg-gray-400 px-4 py-2 rounded-lg text-white"
            >
              NO
            </button>
            <button
              className="bg-red-600 ml-2 px-4 py-2 rounded-lg text-white"
              onClick={deleteProduct}
            >
              YES
            </button>
          </div>
        </div>
      </Model>
    </div>
  );
};

export default Modal;
