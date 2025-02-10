import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './thanh-toan-list.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as orderDetailService from "../../../service/orderdetails-service";
import {toast} from "react-toastify";

function ListThanhToan() {
    const location = useLocation();
    const { tableCode } = location.state || {};
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false);
    const [isReset, setIsReset] = useState(false); // Thêm state để theo dõi trạng thái reset bàn

    useEffect(() => {
        console.log(id)
        fetchOrders(); // Tải dữ liệu khi component mount
    }, [id, isPaid, isReset]); // Thêm isReset vào dependency array
    // useEffect(() => {
    //     if (refreshedTables[id]) {
    //         // Clear old data for refreshed tables
    //         setOrderDetails([]);
    //     }
    //     fetchOrders();
    // }, [id]);



    // const fetchOrders = async () => {
    //     // Chỉ fetch dữ liệu mới nếu bàn chưa thanh toán và chưa reset
    //     if (!isPaid) {
    //         try {
    //             const response = await orderDetailService.getAllOrderDetails(id);
    //             setOrderDetails(response.data);
    //             console.log(response.data)
    //         } catch (error) {
    //             console.error('Error fetching orders:', error);
    //         }
    //     }
    // };
    const fetchOrders = async () => {
        try {
            const response = await orderDetailService.getAllOrderDetails(id);
            const newOrders = response.data.filter(order => order.status !== "done");
            setOrderDetails(newOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    // const fetchOrders = async () => {
    //     if (!isPaid && !isReset) {
    //         try {
    //             const response = await orderDetailService.getAllOrderDetails(id);
    //             // Giả định rằng response.data chứa danh sách đơn hàng
    //             const updatedOrders = response.data.map(order => {
    //                 // Cập nhật status về 0 nếu bàn đã được làm mới
    //                 if (isReset) {
    //                     return { ...order, status: "0" };
    //                 }
    //                 return order;
    //             });
    //             setOrderDetails(updatedOrders);
    //             console.log(updatedOrders);
    //         } catch (error) {
    //             console.error('Error fetching orders:', error);
    //         }
    //     }
    // };

    // const calculateTotalAmount = () => {
    //     if (orderDetails){
    //         return orderDetails.reduce((total, order) => {
    //             return total + order.totalMoneyOrder;
    //         }, 0);
    //     }
    // };

    const calculateTotalAmount = () => {
        if (orderDetails) {
            const filteredOrders = orderDetails.filter(order => order.status !== "done");

            // Tính tổng tiền của các đơn hàng đã được lọc
            return filteredOrders.reduce((total, order) => {
                return total + order.totalMoneyOrder;
            }, 0);
        }
    };

    const formattedTotalAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        currencyDisplay: 'narrowSymbol'
    }).format(calculateTotalAmount());

    const handleThanhToanClick = () => {
        if (orderDetails.length === 0) {
            toast.error("Không thể thanh toán khi không có dữ liệu!");
            return;
        }

        if (isPaid) {
            toast.error("Bàn đã thanh toán rồi!");
            return;
        }

        toast.success("Thanh toán thành công!");
        setIsPaid(true);
    };

    const handleLamMoiBanClick = async () => {
        if (!isPaid) {
            toast.error("Không thể làm mới bàn khi chưa thanh toán!");
            return;
        }

        try {
            await handleResetTable(id);
            // setOrderDetails(prevOrders => prevOrders.map(order => ({ ...order, status: "0" }))); // Cập nhật trạng thái trong UI
            // setOrderDetails([]);
            // Xóa dữ liệu hiện tại trong UI
            setIsPaid(false); // Đặt trạng thái thanh toán về false
            setIsReset(true); // Đánh dấu bàn đã được reset
            toast.success("Làm mới bàn thành công!");
        } catch (error) {
            console.error("Error refreshing table:", error);
            toast.error("Có lỗi xảy ra khi làm mới bàn.");
        }
    };

    const handleResetTable = async (tableId) => {
        try {
            await orderDetailService.handleResetTable(tableId); // Gọi phương thức từ service
            console.log('Trạng thái đơn hàng đã được cập nhật về 0');
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
    };

    // const handleLamMoiBanClick = async () => {
    //     if (!isPaid) {
    //         toast.error("Không thể làm mới bàn khi chưa thanh toán!");
    //         return;
    //     }
    //
    //     try {
    //         refreshedTables[id] = true;
    //         localStorage.setItem("refreshedTables", JSON.stringify(refreshedTables));
    //
    //         setOrderDetails([]); // Clear current data for the table
    //         setIsPaid(false);
    //         toast.success("Làm mới bàn thành công!");
    //     } catch (error) {
    //         console.error("Error refreshing table:", error);
    //         toast.error("Có lỗi xảy ra khi làm mới bàn.");
    //     }
    // };




    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="btn btn-light" href="">
                                    <FontAwesomeIcon icon={faHouse} /> Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-light" onClick={() => navigate('/tables')}>
                                    <FontAwesomeIcon icon={faRotateLeft} /> Back
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="row">
                <div className="col-md-12 text-center"> {/* Add text-center class here */}
                    <h3><strong>Caluclator money {tableCode}</strong>

                    </h3>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>STT</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Infomation</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Quantity</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Price(VND)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{orderDetails*/}
                        {/*    .filter(order => order.status === "pending") // Lọc những đơn hàng có status là "pending"*/}
                        {/*    .map((order, index) => (*/}
                        {/*        <tr key={order.orderDetailId}>*/}
                        {/*            <td style={{ textAlign: 'center' }}>{index + 1}</td>*/}
                        {/*            <td style={{ textAlign: 'center' }}>*/}
                        {/*                /!* Hiển thị thông tin sản phẩm *!/*/}
                        {/*                {order.products && order.products.length > 0 && (*/}
                        {/*                    <div>*/}
                        {/*                        {order.products.map((product, i) => (*/}
                        {/*                            <div key={i} className="product-item">*/}
                        {/*                                <p><strong>`Name:</strong> {product.productName}</p>*/}
                        {/*                                <p>*/}
                        {/*                                    <strong>Price:</strong>*/}
                        {/*                                    {new Intl.NumberFormat('vi-VN', {*/}
                        {/*                                        style: 'currency',*/}
                        {/*                                        currency: 'VND',*/}
                        {/*                                        minimumFractionDigits: 0*/}
                        {/*                                    }).format(product.productPrice)}*/}
                        {/*                                </p>*/}
                        {/*                            </div>*/}
                        {/*                        ))}*/}
                        {/*                    </div>*/}
                        {/*                )}*/}
                        {/*            </td>*/}
                        {/*            <td style={{ textAlign: 'center' }}>{order.quantity}</td>*/}
                        {/*            <td style={{ textAlign: 'center' }}>*/}
                        {/*                /!* Hiển thị tổng tiền của đơn hàng *!/*/}
                        {/*                {new Intl.NumberFormat('vi-VN', {*/}
                        {/*                    style: 'currency',*/}
                        {/*                    currency: 'VND',*/}
                        {/*                    minimumFractionDigits: 0*/}
                        {/*                }).format(order.totalMoneyOrder)}*/}
                        {/*            </td>*/}
                        {/*        </tr>*/}
                        {/*    ))}*/}
                        {orderDetails && orderDetails.length > 0 ? (
                            orderDetails
                                .filter(order => order.status === "pending")
                                .map((order, index) => (
                                    <tr key={order.orderDetailId}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {order.products && order.products.length > 0 ? (
                                                <div>
                                                    {order.products.map((product, i) => (
                                                        <div key={i} className="product-item">
                                                            <p><strong>Name:</strong> {product.productName}</p>
                                                            <p><strong>Price:</strong> {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                                minimumFractionDigits: 0
                                                            }).format(product.productPrice)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>No products available</p>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{order.quantity}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                                minimumFractionDigits: 0
                                            }).format(order.totalMoneyOrder)}
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className="pagination-container text-center">
                        <button
                            id="pay"
                            className="btn btn-primary no-border"
                            style={{ backgroundColor: '#bd965f' }}
                            data-bs-toggle="modal"
                            data-bs-target="#tinhtien"
                        >
                            Calculator
                        </button>
                        <button
                            id="renewtable"
                            className="btn btn-secondary no-border"
                            style={{ backgroundColor: '#bd965f' }}
                            data-bs-toggle="modal"
                            data-bs-target="#lammoiban"
                        >
                           Reset Table
                        </button>
                    </div>

                    {/* Modal for calculating payment */}
                    <div className="modal fade" id="tinhtien" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Số tiền cần thanh toán là: {formattedTotalAmount}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" style={{ backgroundColor: '#bd965f'}} onClick={handleThanhToanClick} data-bs-dismiss="modal">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Modal for renewing table */}
                    <div className="modal fade" id="lammoiban" tabIndex="-1" aria-labelledby="new" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="new">Bạn có muốn làm mới bàn không?</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary no-border" style={{ backgroundColor: '#bd965f' }} onClick={handleLamMoiBanClick} data-bs-dismiss="modal">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListThanhToan;
