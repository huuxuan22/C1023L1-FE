import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getProductById} from "../../../service/ProductService";
import {Link} from "react-router-dom";
import st from "../product-update/create-update.module.css";
import Header from "../../home/header/header";
import Footer from "../../home/footer/footer";

function ProductDetail() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [product, setProduct] = useState("");
    const {id} = useParams();
    useEffect(() => {
        getProductById(id).then((data) => {
            setProduct(data);
        })
    },[id])
    if (!product){
        return <div>Loading...</div>
    }
    return (
        <div>
            <Header token={token} roles={role}/>
            <div className={`${st["outer-div"]} ${st["create-update"]}`}>
            <div className="container mt-5">
                <div className="row g-3">
                    <div className="col-md-2">
                        <div className="container-fluid">
                            <div className="row">
                                <nav className="col-md-3 vertical-nav">
                                    <div className="nav flex-column">
                                        <Link to={'/product'} className="nav-link">Home</Link>
                                        <a className="nav-link active" href="#"
                                           onClick="setActive(this)">Detail</a>
                                        <Link to={'/create'} className="nav-link">Create Product</Link>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div style={{width: "100%", textAlign: "center"}}>  <img src={product.productImgUrl} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: "140px", marginTop: "10px", display: 'block', margin: '0 auto' }} /></div>
                        <div style={{width: "100%", textAlign: "center"}}><h3>{product.productName}</h3></div>
                        <hr />
                            <div className="d-flex justify-content-between">
                                <div><h5 className="card-title">Product Details</h5></div>
                                <div><Link to={`/product/${id}`} className={st["edit-hover"]}><i
                                    className="fa-solid fa-pen-to-square"></i></Link> </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-muted">Product Name</div>
                                <div>{product.productName}</div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-muted">Product Code</div>
                                <div>{product.productCode}</div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-muted">Product Price</div>
                                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.productPrice)}</div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className=" text-muted">Category</div>
                                <div>{product.category.categoryName}</div>
                            </div>
                            <hr />
                                {/*Nút gửi*/}
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Link to={`/product`} type="button" className={`btn btn-secondary ${st["btn-hover"]}`}
                                                style={{borderRadius: "50px"}}><i
                                            className="bi bi-arrow-left"></i> Back
                                        </Link>
                                    </div>
                                </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    )
}
export default ProductDetail;