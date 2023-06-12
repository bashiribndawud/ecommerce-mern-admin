import React, { useEffect, useState } from "react";
import { validateNewProduct } from "../utils/validation";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { ReactSortable } from "react-sortablejs";

const ProductForm = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEditPage = pathname.includes("/product/edit/");
  const id = pathname.split("/")[3];
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [productProperties, setProductProperties] = useState({})
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  async function handformSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (isEditPage) {
      const { data, status } = await axios.put(
        "/product/update",
        { name, category, description, price, images, productProperties },
        { params: { id } }
      );
      if (status === 200) {
        navigate("/products");
        toast.success("Product updated");
      }
    } else {
      // console.log(name, category, description, images, price)
      const { data, status } = await axios.post("/product/new", {
        name,
        category,
        description,
        price,
        images,
        productProperties
      });
      if (status === 201) {
        navigate("/products");
      }
    }
  }

  async function handleFileUpload(e) {
    setUploading(true);
    const files = e.currentTarget.files;
    if (files?.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
      const {
        data: { fileNames },
      } = await axios.post("/product/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prevImages) => {
        return [...prevImages, ...fileNames];
      });
      setUploading(false);
    }
  }

  const removeImage = async (link) => {
    try {
      if(id){
        const {
          data: { message },
          status,
        } = await axios.put(`/product/files/${link}/${id}`);

        if (status === 200) {
          const newImage = images.filter((image) => image !== link);
          setImages(newImage);
          toast.success(message);
        }
      }else {
        const {
          data: { message },
          status,
        } = await axios.post(`/product/removeFile/${link}`);

        if (status === 200) {
          const newImage = images.filter((image) => image !== link);
          setImages(newImage);
          toast.success(message);
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error.response.data.error);
    }
  };

  function updateImagesOrder(images) {
    setImages(images);
  }
  const propertiesToFill = [];
  if(category && categories.length > 0){
    let CatInfo = categories.find(({_id}) => _id === category)
    propertiesToFill.push(...CatInfo.properties)
    while (CatInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === CatInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties)
      CatInfo = parentCat
    }
  }
  useEffect(() => {
    axios.get("/category/all").then((result) => {
      setCategories(result.data);
    });
  }, []);
  // console.log(propertiesToFill)
  useEffect(() => {
    if (id) {
      const editProductData = async () => {
        const { data, status } = await axios.get("/product/edit", {
          params: { id },
        });
        console.log(data)
        if(status === 200){
          setName(data.name)
          setCategory(data?.category?._id)
          setDescription(data.description)
          setPrice(data.price);
          setImages(prevImages => {
            return [...prevImages, ...data.images]
          })
          setProductProperties(data.properties)
        }
      };
      editProductData();
    }
  }, []);
  function setProductProp(prodName, value){
    setProductProperties(prevProps => {
      const newProductProps = {...prevProps}
      newProductProps[prodName] = value;
      return newProductProps
    })
  }
  return (
    <div className="">
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
      <h2 className="font-bold pb-4 text-2xl text-gray-600">
        {isEditPage ? "Edit Product" : "New Product"}
      </h2>
      <form onSubmit={handformSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="border p-2 rounded-md mb-2">
          <select
            className="bg-transparent px-2 flex-1 rounded-lg w-full"
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" className="bg-white">
              Select Category
            </option>
            {categories?.length > 0 &&
              categories?.map((category) => (
                <option value={category?._id}>{category?.name}</option>
              ))}
          </select>
        </div>
        {propertiesToFill?.length > 0 &&
          propertiesToFill?.map((p, index) => (
            <div className="" key={index}>
              <label className="">{p?.name[0].toUpperCase()+p.name.substring(1)}</label>
              <select
                value={productProperties[p?.name]}
                onChange={(e) => setProductProp(p?.name, e.target.value)}
                className="p-3 flex-1 rounded-lg w-full border mb-2 focus:outline-none"
              >
                {p?.values?.split(",").map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          ))}
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            className="flex flex-wrap gap-1"
            list={images}
            setList={updateImagesOrder}
          >
            {images?.length > 0 &&
              images?.map((link) => (
                <div key={link} className="h-24 inline-block relative">
                  <img
                    src={`http://localhost:9000/getFiles/uploads/${link}`}
                    alt=""
                    className="object-fit h-24 rounded-lg"
                  />
                  <div
                    className="absolute bottom-2 p-1 rounded-full text-white right-3 bg-red-400"
                    onClick={() => removeImage(link)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              ))}
          </ReactSortable>
          <label
            htmlFor="photos"
            className="bg-blue-400 shadow-md w-24 h-24 text-center p-1 rounded text-white flex items-center justify-center gap-1 hover:cursor-pointer"
          >
            {" "}
            Upload
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </label>
          {uploading && (
            <div className="border flex items-center ">
              <Loader className="text-blue-500" />
            </div>
          )}
          <input
            type="file"
            name="photos"
            id="photos"
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
          {images.length < 0 ||
            (!images && (
              <div>
                <p className="my-2 text-gray-500">No Photos have been addedd</p>
              </div>
            ))}
        </div>
        <div className="mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            cols="10"
            rows="7"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price">Price (in USD)</label>
          <input
            type="text"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full"
          />
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {isEditPage ? "Update" : "Save"}
          {loading ? (
            <Loader />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
