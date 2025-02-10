import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './list-bill.module.css';
import { isValid, format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';

const ListBill = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInvoiceNumber, setSearchInvoiceNumber] = useState('');
    const [searchCreatedDate, setSearchCreatedDate] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State để quản lý hóa đơn được chọn

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InZvdGhpdHVvbmd2eV9uZXciLCJzdWIiOiJ2b3RoaXR1b25ndnlfbmV3IiwiZXhwIjoyMDkwMTIyMTcyfQ.4FSvb1wDUgIdBdnK7T7bbOZ8c5wtvpuHUJhgueGJzfo"; // Thay thế bằng token thực tế
            const response = await axios.get('http://localhost:8080/api/orders/bill', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sortedInvoices = response.data.sort((a, b) => {
                const dateA = new Date(...a.dayCreate);
                const dateB = new Date(...b.dayCreate);
                return dateB - dateA;
            });
            setInvoices(sortedInvoices);
            setFilteredInvoices(sortedInvoices);
            setTotalPages(Math.ceil(sortedInvoices.length / 5));
        } catch (error) {
            console.error("Error loading invoices:", error);
        }
    };

    const loadInvoiceDetail = async (id) => {
        try {
            const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InZvdGhpdHVvbmd2eV9uZXciLCJzdWIiOiJ2b3RoaXR1b25ndnlfbmV3IiwiZXhwIjoyMDkwMTIyMTcyfQ.4FSvb1wDUgIdBdnK7T7bbOZ8c5wtvpuHUJhgueGJzfo"; // Thay thế bằng token thực tế
            const response = await axios.get(`http://localhost:8080/api/orders/bill/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSelectedInvoice(response.data);
        } catch (error) {
            console.error("Error loading invoice detail:", error);
        }
    };

    const handleSearch = () => {
        const filtered = invoices.filter(invoice => {
            const formattedInvoiceNumber = `HD00${invoice.orderId}`;
            const matchesInvoiceNumber = formattedInvoiceNumber.includes(searchInvoiceNumber);

            let matchesCreatedDate = true;
            if (searchCreatedDate) {
                const invoiceDate = new Date(...invoice.dayCreate); // Đảm bảo ngày của hóa đơn là đối tượng Date
                const formattedSearchDate = new Date(searchCreatedDate); // Chuyển đổi ngày tìm kiếm thành đối tượng Date
                // Kiểm tra xem ngày tháng của invoiceDate có trùng với formattedSearchDate không
                matchesCreatedDate = invoiceDate.toDateString() === formattedSearchDate.toDateString();
            }

            return matchesInvoiceNumber && matchesCreatedDate;
        });
        setFilteredInvoices(filtered);
        setTotalPages(Math.ceil(filtered.length / 5));
        setCurrentPage(1);
    };
    const showInvoiceDetail = (invoice) => {
        loadInvoiceDetail(invoice.orderId); // Tải chi tiết hóa đơn
    };

    const handleClose = () => setSelectedInvoice(null); // Đóng modal

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const indexOfLastInvoice = currentPage * 5;
    const indexOfFirstInvoice = indexOfLastInvoice - 5;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

    return (
        <div className="container my-5">
            <div className="header-container">
                <h2>List of bills</h2>
            </div>

            <div className="outer-container">
                <div className="search-box mb-3">
                    <button className="btn btn-add"><i className="fas fa-file-invoice"></i> Add bill</button>
                    <div className="d-flex align-items-center ms-auto">
                        <label htmlFor="invoice-number">Bill Number </label>
                        <input
                            type="text"
                            className="form-control"
                            id="invoice-number"
                            placeholder="Enter bill number..."
                            value={searchInvoiceNumber}
                            onChange={(e) => setSearchInvoiceNumber(e.target.value)}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="created-date" className="ms-3">Date created </label>
                        <input
                            type="date"
                            className="form-control"
                            id="created-date"
                            value={searchCreatedDate}
                            onChange={(e) => setSearchCreatedDate(e.target.value)}
                            style={{ width: 'auto' }}
                        />
                        <button className="btn" onClick={handleSearch}><i className="fas fa-search"></i> Search </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Bill Number</th>
                            <th>Date Created</th>
                            <th>Created By</th>
                            <th>Table Number</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentInvoices.length > 0 ? (
                            currentInvoices.map((invoice, index) => {
                                const formattedDate = isValid(new Date(...invoice.dayCreate))
                                    ? format(new Date(...invoice.dayCreate), "dd-MM-yyyy")
                                    : "N/A";

                                const formattedTotalMoneyOrder = (invoice.totalMoneyOrder ).toLocaleString();

                                return (
                                    <tr key={invoice.orderId}>
                                        <td>{indexOfFirstInvoice + index + 1}</td>
                                        <td>HD00{invoice.orderId}</td>
                                        <td>{formattedDate}</td>
                                        <td>{invoice.creatorName}</td>
                                        <td>{invoice.tableName}</td>
                                        <td>{formattedTotalMoneyOrder} VND</td>
                                        <td>
                                            <button className="btn-action view" onClick={() => showInvoiceDetail(invoice)}>
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">There is no invoice .</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation">
                    <div className="d-flex justify-content-end align-items-center">
                        <span className="me-2">You are on page</span>
                        <input
                            type="number"
                            className="page-input"
                            min="1"
                            value={currentPage}
                            onChange={(e) => handlePageChange(Number(e.target.value))}
                            style={{ marginRight: '10px', width: '50px' }}
                        />
                        <span className="mx-2">/ {totalPages}</span>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => handlePageChange(1)} style={{ marginRight: '5px' }}>First Page</a>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link pagination-prev" href="#" onClick={() => handlePageChange(currentPage - 1)} style={{ marginRight: '5px' }}>«</a>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link pagination-next" href="#" onClick={() => handlePageChange(currentPage + 1)} style={{ marginRight: '5px' }}>»</a>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => handlePageChange(totalPages)}>Last page</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Modal show={!!selectedInvoice} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Bill Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedInvoice && (
                            <div>
                                <p><strong>Bill Number:</strong> HD00{selectedInvoice.orderId}</p>
                                <p><strong>Date Created:</strong> {format(new Date(...selectedInvoice.dayCreate), "dd-MM-yyyy HH:mm:ss")}</p>
                                <p><strong>Created By:</strong> {selectedInvoice.creatorName}</p>
                                <p><strong>Table Number:</strong> {selectedInvoice.tableName}</p>
                                <p><strong>Product Details:</strong></p>
                                <ul>
                                    {selectedInvoice.productDetails.map((product, index) => (
                                        <li key={index}>{product}</li>
                                    ))}
                                </ul>
                                <p><strong>Quantity:</strong> {selectedInvoice.quantily}</p>
                                <p><strong>Total Amount:</strong> {(selectedInvoice.totalMoneyOrder  ).toLocaleString()} VND</p>


                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ListBill;
