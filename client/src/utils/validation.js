import toast from "react-hot-toast"

export const loginValidation = (values) => {
    const errors = {};
    const reg = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    if (!values.email) {
      errors.email = toast.error("Email Required");
    }else if(!reg.test(values.email)){
        errors.email = toast.error("Invalid Email");
    }
    else if (!values.password) {
      errors.password = toast.error("Passowrd Required");
    }
    return errors
}

export const validateNewProduct = (values) => {
    const errors = {}
    if(!values.name){
        errors.name = toast.error('Product Name Required')
    }
    if(!values.description){
        errors.description = toast.error("Description Required");
    }
    if (!values.price) {
      errors.price = toast.error("Price Required");
    }
    // if(values.photos?.length < 0){
    //     error.photos = toast.error("Add a photo")
    // }

    return errors
}