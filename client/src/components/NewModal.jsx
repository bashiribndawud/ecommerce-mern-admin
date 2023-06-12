import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
const NewModal = ({
  isModalOpen,
  closeModal,
  selectedItem,
  setIsModalOpen,
  getAllCategories,
}) => {
  async function deleteCategory() {
    const {
      status,
      data: { message },
    } = await axios.delete("/category/delete", {
      params: { _id: selectedItem?._id },
    });
    if (status === 200) {
      toast.success(message);
    }
    setIsModalOpen(false);
    getAllCategories()
  }
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className="w-[50%] h-[40%] mx-auto my-24 bg-white shadow-xl rounded-lg"
    >
      {selectedItem && (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-gray-500 my-3">
            Are You Sure?
          </h2>
          <p className="text-gray-500">
            Do you want to delete {selectedItem?.name}?
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-white rounded bg-gray-500"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={deleteCategory}
            >
              Yes, Delete!
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NewModal;
