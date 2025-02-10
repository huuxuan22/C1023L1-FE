import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {getAllCategories} from "../../../service/CategoriesService";
import {checkProductName, getProductById, updateProduct} from "../../../service/ProductService";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../../firebaseConfig/firebase";
import {toast} from "react-toastify";
import st from "./create-update.module.css";
import Header from "../../home/header/header";
import Footer from "../../home/footer/footer";
function ProductUpdate() {
    const [product, setProduct] = useState();
    const [categories, setCategories] = useState([]);
    const {id} =useParams();
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();
    // const [check, setCheck] = useState(true);
    useEffect(() => {
        getAllCategories().then((data) => {
            console.log(data);
            setCategories(data);
        });
        getProductById(id).then((data) => {
            console.log(data);
            setProduct(data);
            setImageUrl(data.productImgUrl);
        });
    },[id])
    // tai hinh anh len firebase
    const handleUpload = async (file) => {
        if (!file) return;
        try {
            const storageRef = ref(storage, `productImg/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref); // lay url cua anh da tai len
            return url;
        }catch (e) {
            console.error("Error uploading file:",e)
            return null;
        }
    }


    const editProduct = async (value) => {
        // let isNameChanged = product.productName !== value.productName; // Kiểm tra xem tên có thay đổi không
        // let isNameValid = true;

        // if (isNameChanged) {
        //     isNameValid = await checkProductName(value.productName);
        //     if (!isNameValid) {
        //         toast.error("Product name already exists");
        //         return;
        //     }
        // }
        console.log("Form value:", value);
        value.productImgUrl = imageUrl;
        const prdData = {
            ...value,
            category:{
                categoryId: value.category
            }
        }
        console.log("đây là dữ liệu: ");
        
        console.log(prdData)
        updateProduct(prdData, id).then(() => {
            toast.success("Update success");
            navigate("/product")
        })
    }
    const validate = {
        productName: Yup.string().required("Product must not be empty").min(3, "Product name at least 3 characters"),
        productPrice: Yup.number().positive("Price must be greater than 0 VND").required("Product price is required"),
        category: Yup.string().required("Category is required")
    }

    if (!product || !categories){
        return <div>Loading</div>
    }
    return (
        <div>
            <Header/>
            <div className={`${st["outer-div"]} ${st["create-update"]}`}>
                <div className="container mt-5">
                    <div className="row g-3">
                        <h1 style={{
                            textAlign: "center",
                            color: "#2a2a2a",
                            backgroundColor: "#d3d3d3",
                            borderRadius: "10px",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                        }}>
                            Update Product
                        </h1>
                        <div className="col-md-2">
                            <div className="container-fluid">
                                <div className="row">
                                    <nav className="col-md-3 vertical-nav">
                                        <div className="nav flex-column">
                                            <Link to={'/product'} className="nav-link">Home</Link>
                                            <a className="nav-link active" href="#">Update Product</a>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <Formik initialValues={{
                                productName: product.productName || '', // Giá trị mặc định cho tên sản phẩm
                                productPrice: product.productPrice || '', // Giá trị mặc định cho giá sản phẩm
                                productCode: product.productCode || '', // Giá trị mặc định cho mã sản phẩm
                                productImgUrl: product.productImgUrl || '', // Giá trị mặc định cho hình ảnh
                                category: product.category ? product.category.categoryId : '', // Giá trị mặc định cho category
                            }}
                                    enableReinitialize={true} // Allow Formik to reinitialize when initialValues change
                                    validationSchema={Yup.object(validate)}
                                    validateOnMount={true}
                                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                                        try {
                                            
                                            await editProduct(values);
                                        } catch (error) {
                                            console.error("Error submitting form:", error);
                                            setErrors({ submit: error.message });
                                        } finally {
                                            // setSubmitting(false);
                                        }
                                    }}
                            >
                                {() => (
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
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                const url = await handleUpload(file); // tải lên và lấy URL
                                                                setImageUrl(url); // lưu vào state để hiển thị
                                                                form.setFieldValue("productImgUrl", url); // lưu URL để submit vào database
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

                                        {/* Input cho mã sản phẩm */}
                                        <div className="mb-3">
                                            <label htmlFor="productCode" className="form-label">Code</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="code-icon"><i className="bi bi-qr-code"></i></span>
                                                <Field
                                                    type="text"
                                                    name="productCode"
                                                    className={`form-control ${st["form-input-custom"]}`}
                                                    readOnly
                                                />
                                            </div>
                                            <ErrorMessage name="productCode" component="p" className="text-danger" />
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
                                                    className={`form-control ${st["form-input-custom"]}`}
                                                >
                                                    {/*/!* Kiểm tra nếu product.category tồn tại *!/*/}
                                                    {/*{product.category && (*/}
                                                    {/*    <option value={product.category.categoryId}>{product.category.categoryName}</option>*/}
                                                    {/*)}                */}
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
                                                Update <i className="bi bi-arrow-right"></i>
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
export default ProductUpdate;