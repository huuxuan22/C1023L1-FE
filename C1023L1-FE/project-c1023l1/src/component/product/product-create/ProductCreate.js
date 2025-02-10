import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import st from "./../product-update/create-update.module.css";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {toast} from "react-toastify";
import {getAllCategories} from "../../../service/CategoriesService";
import {checkProductName, createProduct, getAllProducts} from "../../../service/ProductService";
import {storage} from "../../../firebaseConfig/firebase";
import {Link} from "react-router-dom";
import Header from "../../home/header/header";
import Footer from "../../home/footer/footer";


function ProductCreate() {
    const [categories, setCategories] = useState([]);
    const [productImg, setProductImg] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [initialValues, setInitialValues] = useState({
        productImgUrl: "",
        productName: "",
        productPrice: "",
        productCode: "",
        category: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        getAllCategories().then((data) => {
            setCategories(data);
            console.log(data)
        });
    }, []);
    const saveProduct = async (value) => {
        // console.log("start Product")
        // const checkPrdName = await checkProductName(value.productName);
        // console.log("aaaaaa", value.productName)
        // if (checkPrdName) {
        //     toast.error("Product name already exist");
        //     return ;
        // }
        console.log("Form Values:", value); // Thêm log để xem giá trị form
        // const imgUrl = imageUrl; //su dung url da tai len tu stat
        // if (productImg){
        //     value.productImgUrl = imgUrl;
        //     // Tìm category tương ứng từ danh sách categories
        //     const productData = {
        //         ...value,
        //         category:{
        //             categoryId: value.category
        //         }
        //     }
        //     console.log(productData)
        //     createProduct(productData).then(() => {
        //         toast.success("Add new success");
        //         navigate("/product");
        //     })
        // }else {
        //     toast.error("Image URL is empty. Please upload an image."); // Thông báo nếu không có URL hình ảnh
        // }
        let imgUrl = "";
        if (productImg){
            try {
                const storageRef = ref(storage, `productImg/${productImg.name}`);
                const snapshot = await uploadBytes(storageRef, productImg);
                imgUrl = await getDownloadURL(snapshot.ref);
            }catch (e) {
                console.error("Error uploading file:", e);
                toast.error("Failed to upload image");
                return;
            }
        }
        
        const productData = {
            ...value,
            productImgUrl: imgUrl,
            categoryId:  value.category   
        };
       
        
        createProduct(productData).then(() => {
            toast.success("Add new success");
            navigate("/product");
        }).catch((e) => {
            console.error("Error creating product:", e);
            toast.e("Failed to save product");
        });
    };
    const validate = {
        productName: Yup.string().required("Product must not be empty").min(3, "Product name at least 3 characters"),
        productPrice: Yup.number().positive("Price must be greater than 0 VND").required("Product price is required"),
        category: Yup.string().required("Category is required")
    }

    if (!categories) {
        return <div>Loading</div>;
    }

    return (
        <div>
            <Header/>
            <div className={`${st["outer-div"]} ${st["create-update"]}`}>
                <div className={`container mt-5`}>
                    <div className="row g-3">
                        <h1 style={{
                            textAlign: "center",
                            color: "#2a2a2a",
                            backgroundColor: "#d3d3d3",
                            borderRadius: "10px",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                        }}>
                            Create Product
                        </h1>
                        <div className="col-md-2">
                            <div className="container-fluid">
                                <div className="row">
                                    <nav className="col-md-3 vertical-nav">
                                        <div className="nav flex-column">
                                            <Link to={'/product'} className="nav-link">Home</Link>
                                            <a className="nav-link active" href="#">Create Product</a>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <Formik initialValues={initialValues}
                                    enableReinitialize={true} // Allow Formik to reinitialize when initialValues change
                                    validationSchema={Yup.object(validate)}
                                    validateOnMount={true}
                                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                                        try {
                                            console.log("Submitting:", values);
                                            await saveProduct(values);
                                        } catch (error) {
                                            console.error("Error submitting form:", error);
                                            setErrors({ submit: error.message });
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                            >
                                {({ setFieldValue }) => (
                                    <Form>
                                        {/* Input cho tải lên hình ảnh */}
                                        <Field name="productImgUrl">
                                            {({ form }) => (
                                                <div className="mb-3">
                                                    <label htmlFor="productImgUrl" className={`form-label ${st["custom-file-label"]}`}>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            id="productImgUrl"
                                                            accept="image/*"
                                                            style={{ width: "100%" }}
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                setProductImg(file); // lưu file đã tải lên
                                                                const objectUrl = URL.createObjectURL(file);
                                                                setImageUrl(objectUrl); // Hiển thị ảnh từ file trong máy
                                                            }}
                                                            hidden
                                                        />
                                                        {imageUrl ? ( // Hiển thị ảnh đã tải lên
                                                            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: "140px", marginTop: "10px", display: 'block', margin: '0 auto' }} />
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-upload"></i><br />
                                                                <span style={{ color: "#bd965f" }}>Click to upload</span> or drag and drop<br />
                                                                <span className="span1">PDF, JPG, JPEG, PNG less than 5MB.</span>
                                                            </>
                                                        )}
                                                    </label>
                                                    <ErrorMessage name="productImgUrl" component="p" className="text-danger" />
                                                </div>
                                            )}
                                        </Field>

                                        {/* Input cho tên sản phẩm */}
                                        <div className="mb-3">
                                            <label htmlFor="productName" className="form-label">Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="name-icon"><i className="bi bi-cup"></i></span>
                                                <Field
                                                    type="text"
                                                    name="productName"
                                                    className={`form-control ${st["form-input-custom"]}`}
                                                    placeholder="Enter product name"
                                                />
                                            </div>
                                            <ErrorMessage name="productName" component="p" className="text-danger" />
                                        </div>

                                        {/* Input cho giá sản phẩm */}
                                        <div className="mb-3">
                                            <label htmlFor="productPrice" className="form-label">Price</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="price-icon"><i className="bi bi-tag"></i></span>
                                                <Field
                                                    type="text"
                                                    name="productPrice"
                                                    className={`form-control ${st["form-input-custom"]}`}
                                                    placeholder="Enter product price"
                                                    // value={formatPriceInput(initialValues.productPrice)}
                                                    // onChange={(e) => setFieldValue("productPrice", formatPriceInput(e.target.value))}
                                                />
                                            </div>
                                            <ErrorMessage name="productPrice" component="p" className="text-danger" />
                                        </div>

                                        {/* Chọn loại sản phẩm */}
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="type-icon"><i className="bi bi-list"></i></span>
                                                <Field
                                                    as="select"
                                                    name="category"
                                                    className={`form-control ${st["form-input-custom"]} ${st["select-container"]}`}
                                                >
                                                    {categories.map((category) => (
                                                        <option key={category.categoryId} value={category.categoryId}>
                                                            {category.categoryName}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                            <ErrorMessage name="category" component="p" className="text-danger" />
                                        </div>
                                        <hr />

                                        {/* Nút gửi */}
                                        <div className="d-flex justify-content-between">
                                            <Link to="/product" style={{ color: "black" }} className={st["btn-hover"]}>Cancel</Link>
                                            <button type="submit"   onClick={() => console.log("Button clicked")} // Log để kiểm tra
                                                    className={`btn btn-secondary ${st["btn-hover"]}`} style={{ border: "none", borderRadius: "50px", backgroundColor: "#bd965f" }}>
                                                Create <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ProductCreate;
