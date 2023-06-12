import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { Link, useLocation } from "react-router-dom";
import NewModal from "../components/NewModal";

// import { withSwal } from "react-sweetalert2";

const ValidateCategory = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = toast.error("Category Required");
  }
};

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryForEdit, setCategoryForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = (category) => {
    setSelectedItem(category);
    setIsModalOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate: ValidateCategory,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
        console.log(values)
      if (categoryForEdit) {
        const {
          data: { message },
          status,
        } = await axios.put(`/category/edit/${categoryForEdit?._id}`, {
          ...values,
          parentCategory,
          properties: properties.map((p) => ({
            name: p.name,
            values: p.values,
          })),
        });
        formik.setFieldValue("name", "");
        setParentCategory("");
        setCategoryForEdit(null);
        setProperties([]);
        getAllCategories();
        if (status === 200) {
          toast.success(message);
        }
        
      } else {
        await axios.post("/category/new", {
          ...values,
          parentCategory,
          properties: properties.map((p) => ({
            name: p.name,
            values: p.values,
          })),
        });
        formik.setFieldValue("name", "");
        setParentCategory("");
        getAllCategories();
        setProperties([]);
      }
    },
  });
  const getAllCategories = async () => {
    setLoading(true);
    const { data } = await axios.get("/category/all");
    setCategories(data);
    setLoading(false);
  };
  const getEditCategory = async () => {
    const { data } = await axios.get(`/category/edit/${id}`);
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  function editCategory(category) {
    setCategoryForEdit(category);
    setParentCategory(category?.parent?._id ?? "");
    formik.setFieldValue("name", category?.name);
    setProperties(category?.properties);
  }

  function cancelEditCategory() {
    setCategoryForEdit(null);
    formik.setFieldValue("name", "");
    setParentCategory("");
    setProperties([])
  }

  function handleCategoryDelete(category) {
    console.log(category);
  }

  function addProperty() {
    setProperties((prevProp) => {
      return [...prevProp, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(property, newName, index) {
    setProperties((prevProp) => {
      const properties = [...prevProp];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValueChange(property, newValue, index) {
    setProperties((prevProp) => {
      const properties = [...prevProp];
      properties[index].values = newValue;
      return properties;
    });
  }

  function handleRemoveProperty(indexToRemove) {
    setProperties((prevProp) => {
      return prevProp.filter((p, pIndex) => pIndex !== indexToRemove);
    });
  }
  return (
    <div>
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
      <h3 className="text-2xl font-bold text-gray-400">
        {categoryForEdit
          ? "Edit " + categoryForEdit?.name
          : "Create New Category"}
      </h3>
      <form className="mt-4 " onSubmit={formik.handleSubmit}>
        <div className="flex gap-2">
          <input
            value={formik.values.name}
            onChange={formik.handleChange}
            type="text"
            name="name"
            placeholder="Categories"
            id="name"
            className="flex-1"
          />
          <select
            className="border bg-transparent px-2 flex-1 rounded-lg"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="0" className="text-gray-500">
              Select parent category
            </option>
            {categories.length > 0 &&
              categories?.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="my-2">
          <span className="text-gray-500 block">Properties</span>
          <button
            className="p-2 bg-gray-400 text-white rounded-lg"
            type="button"
            onClick={addProperty}
          >
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-2 mt-2" key={index}>
                <input
                  type="text"
                  name=""
                  value={property.name}
                  onChange={(e) =>
                    handlePropertyNameChange(property, e.target.value, index)
                  }
                  placeholder="property name (color)"
                  className="flex-1"
                />
                <input
                  type="text"
                  name=""
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValueChange(property, e.target.value, index)
                  }
                  placeholder="property value (red)"
                  className="flex-1"
                />
                <button
                  className="p-4 rounded-lg text-white bg-red-400"
                  type="button"
                  onClick={() => handleRemoveProperty(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-400 py-2 px-8 rounded-lg shadow-md text-white text-lg"
          >
            Save
          </button>
          {categoryForEdit && (
            <button
              onClick={cancelEditCategory}
              type="button"
              className="bg-gray-400 py-2 px-8 rounded-lg shadow-md text-white text-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <table style={{ display: categoryForEdit ? "none" : "table" }}>
          <thead>
            <tr>
              <td className="text-gray-500">S/N</td>
              <td className="text-gray-500">Category Name</td>
              <td className="text-gray-500">Parent Category</td>
              <td className="text-gray-500">Actions</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories?.map((category, index) => (
                <tr key={category._id}>
                  <td className="text-gray-500">{index + 1}</td>
                  <td className="text-gray-500">{category.name}</td>
                  <td className="text-gray-500">
                    {category.parent?.name ?? ""}
                  </td>
                  <td>
                    <button
                      className="bg-yellow-400 px-4 py-2 text-white  rounded"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openModal(category)}
                      className="bg-red-500 px-4 py-2 text-white ml-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <NewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedItem={selectedItem}
          closeModal={closeModal}
          getAllCategories={getAllCategories}
        />
      )}
    </div>
  );
};

// export default withSwal(({ swal }, ref) => <Categories />);
