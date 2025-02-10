import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import styles from './menu-product.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer, toast} from 'react-toastify';
import * as CategoryService from "../../../service/CategoriesService";
import * as OrderDetailsService from "../../../service/orderdetails-service";
import * as FeedbackService from "../../../service/feedback-service";
import {jwtDecode} from 'jwt-decode';
import {storage} from '../../../../src/firebaseConfig/firebase';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {useLocation, useNavigate} from "react-router-dom";

const MenuProduct = ({selectedTable, tables}) => {
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tableId, setTableId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState({name: '', email: '', content: ''});
    const [feedbackImage, setFeedbackImage] = useState(null);

    const token = localStorage.getItem('token');
    const location = useLocation();
    
    const infTable = location.state;


    
    const navigate = useNavigate();
    useEffect(() => {
        findAllCategory();
        if (selectedCategory) {
            findAllProduct(selectedCategory, page);
        }
    }, [selectedCategory, page]);

    useEffect(() => {
        const infTable = location.state;
        if (infTable) {
            setTableId(infTable.tableId);
        } else {
            setTableId(null);
        }
    }, []);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.sub);
        }
    }, [token]);

    const findAllCategory = () => {
        CategoryService.getAllCategories().then((data) => {
            setCategories(data);
        });
    };

    const findAllProduct = (categoryId, page = 0, size = 4) => {
        OrderDetailsService.findProductsByCategory( categoryId, {pageNumber: page, pageSize: size})
            .then((data) => {
                if (data) {
                    console.log(data.content)
                    setProducts(data.content || []);
                    setTotalPages(data.totalPages || 0);
                } else {
                    setProducts([]);
                }
            })
            .catch(() => {
                setProducts([]);
            });
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setPage(0);
        findAllProduct(categoryId, 0, 20);
    };

    const handleSelectItem = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleConfirmSelection = () => {
        if (quantity > 0) {
            setSelectedItems(prev => {
                const existingItemIndex = prev.findIndex(item => item.id === selectedProduct.productId);
                if (existingItemIndex !== -1) {
                    // Tạo bản sao của selectedItems để cập nhật giá trị mới
                    const updatedItems = [...prev];
                    // Cộng quantity hiện tại vào quantity của sản phẩm
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: updatedItems[existingItemIndex].quantity + quantity,
                    };

                    console.log("Trước khi cộng dồn:", updatedItems[existingItemIndex].quantity - quantity); // Giá trị trước khi cộng dồn
                    console.log("Sau khi cộng dồn:", updatedItems[existingItemIndex].quantity); // Giá trị sau khi cộng dồn
                    return updatedItems;
                } else {
                    // Thêm sản phẩm mới vào danh sách
                    console.log("Thêm sản phẩm mới:", selectedProduct.productName, "với số lượng:", quantity);
                    return [...prev, {
                        id: selectedProduct.productId,
                        name: selectedProduct.productName,
                        price: selectedProduct.productPrice,
                        quantity
                    }];
                }
            });
            setShowModal(false);
            setQuantity(1); // Reset lại quantity về 1 sau khi chọn
        } else {
            toast.error("Số lượng phải lớn hơn 0!");
        }
    };


    const handleCallOrder = async () => {
        console.log(selectedItems);
        
        if (!tableId) {
            toast.error("Vui lòng chọn bàn trước khi gọi món!");
            return;
        }
        try {
            // Tạo đối tượng request DTO và in ra log để kiểm tra
            const callOrderRequestDto = {
                tableId: tableId,
                userName: userId,
                orderDetails: selectedItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    totalMoneyOrder: item.price * item.quantity,
                    shippingDay: new Date().toISOString(),
                    status: 'pending'
                }))
            };


            // Log request DTO và token để kiểm tra
            console.log("Request DTO gửi đi:", callOrderRequestDto);

            // Gọi API callOrder
            await OrderDetailsService.callOrder(token, callOrderRequestDto);
            toast.success("Gọi món thành công!");

            // Reset selected items sau khi gọi món
            setSelectedItems([]);
        } catch (error) {
            console.error("Lỗi khi gọi món:", error.response ? error.response.data : error.message);
            toast.error("Lỗi khi gọi món!");
        }
    };



    const handleCallService = async () => {
        if (!tableId) {
            toast.error("Vui lòng chọn bàn trước khi gọi phục vụ!");
            return;
        }
        try {
            await OrderDetailsService.callService(tableId, token);
            toast.success("Gọi phục vụ thành công!");
        } catch (error) {
            toast.error("Lỗi khi gọi phục vụ!");
        }
    };
    const handleCallBill = async () => {
        if (!tableId) {
            toast.error("Vui lòng chọn bàn trước khi gọi tính tiền!");
            return;
        }
        try {
            await OrderDetailsService.callBill(tableId, token);
            toast.success("Gọi tính tiền thành công!");
        } catch (error) {
            toast.error("Lỗi khi gọi tính tiền!");
        }
    };
    const handleRemoveItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleImageUpload = (e) => {
        setFeedbackImage(e.target.files[0]);
    };

    const handleFeedbackSubmit = async () => {
        if (feedback.name && feedback.email && feedback.content) {
            let imageUrl = null;
            if (feedbackImage) {
                const imageRef = ref(storage, `images/${feedbackImage.name}`);
                await uploadBytes(imageRef, feedbackImage);
                imageUrl = await getDownloadURL(imageRef);
            }

            const feedbackData = {
                nameCustomer: feedback.name,
                emailCustomer: feedback.email,
                content: feedback.content,
            };

            if (imageUrl) {
                feedbackData.imgUrl = imageUrl; // Chỉ thêm imgUrl nếu có
            }

            try {
                await FeedbackService.addFeedBack(feedbackData);
                toast.success("Gửi phản hồi thành công!");
                setFeedback({name: '', email: '', content: ''});
                setFeedbackImage(null);
                setShowFeedbackModal(false);
            } catch (error) {
                console.error("Lỗi khi gửi phản hồi:", error.response ? error.response.data : error.message);
                toast.error("Lỗi khi gửi phản hồi!");
            }
        } else {
            toast.error("Vui lòng điền đầy đủ thông tin phản hồi!");
        }
    };

    return (
        <div className={`${styles.main} d-flex`}>
            <div className={styles.sidebar}>
                <ul className={styles.nav_menu}>
                    {categories.map((category) => (
                        <li className={styles.categoryButton} key={category.categoryId}>
                            <button className={`${styles.btnCategory} btn btn-outline-secondary btn-block mb-2`}
                                    onClick={() => handleCategorySelect(category.categoryId)}>
                                {category.categoryName}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={`${styles.productContainer} flex-grow-1`}>
                <div className="row text-center">
                    {Array.isArray(products) && products.map((product) => (
                        <div key={product.productId} className="col-md-6 mb-2">
                            <div className="card">
                                <img src={product.productImgUrl} alt={product.productName}
                                     className={`${styles.cardImgTop} img-fluid`}/>
                                <div className="card-body">
                                    <h5 className="card-title">{product.productName}</h5>
                                    <p className="card-text">{product.productPrice.toLocaleString()} VNĐ</p>
                                    <button className={`${styles.btn1} btn btn-primary`}
                                            onClick={() => handleSelectItem(product)}>Chọn
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-12">
                            <p>Không có sản phẩm nào để hiển thị.</p>
                        </div>
                    )}
                    <nav aria-label="Page navigation example" className="mt-3">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${page === index ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(index)}>{index + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className={`${styles.container}`}>
                <div className={`${styles.leftPanel} flex-grow-1`}>
                    <h5>Món đã chọn</h5>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên món</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedItems.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                                <td>
                                    <button className={`${styles.btn1} btn btn-danger`}
                                            onClick={() => handleRemoveItem(item.id)}>Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className={styles.totalPrice}>
                        Tổng
                        cộng: {selectedItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VNĐ
                    </div>

                    {/* Table Info */}
                    <ul className={`${styles.choose_table} list-unstyled`}>
                        <li>Bàn: {infTable ? infTable.tableName : "Chưa chọn bàn"}</li>
                        <li>Ngày: {new Date().toLocaleDateString()}</li>
                    </ul>
                </div>

                {/* Button Panel */}
                <div className={`${styles.rightPanel}`}>
                    <div className={`${styles.btn_choose}`}>
                        <button className={`${styles.btn} btn btn-success`} onClick={handleCallOrder}>Gọi món</button>
                        <button className={`${styles.btn} btn btn-warning`} onClick={handleCallBill}>Tính tiền</button>
                        <button className={`${styles.btn} btn btn-secondary`}
                                onClick={() => setShowFeedbackModal(true)}>Gửi phản hồi
                        </button>
                        <button className={`${styles.btn} btn btn-primary`} onClick={handleCallService}>Gọi phục vụ
                        </button>
                    </div>
                </div>
                {/* Modal for product quantity selection */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct && selectedProduct.productName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Số lượng:</Form.Label>
                            <Form.Control type="number" value={quantity}
                                          onChange={(e) => setQuantity(Number(e.target.value))}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="primary" onClick={handleConfirmSelection}>Xác nhận</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for feedback submission */}
                <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Gửi phản hồi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Tên:</Form.Label>
                            <Form.Control type="text" value={feedback.name}
                                          onChange={(e) => setFeedback({...feedback, name: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" value={feedback.email}
                                          onChange={(e) => setFeedback({...feedback, email: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nội dung phản hồi:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={feedback.content}
                                          onChange={(e) => setFeedback({...feedback, content: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Chọn hình ảnh (không bắt buộc):</Form.Label>
                            <Form.Control type="file" onChange={handleImageUpload}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>Hủy</Button>
                        <Button variant="primary" onClick={handleFeedbackSubmit}>Gửi phản hồi</Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer/>
            </div>
        </div>
    );
};

export default MenuProduct;
