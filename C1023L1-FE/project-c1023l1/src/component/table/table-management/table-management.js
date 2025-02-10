// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {Link} from "react-router-dom";

// Modal.setAppElement('#root');

// const TableManagement = () => {
//     const [tables, setTables] = useState([]);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [currentTable, setCurrentTable] = useState({ id: '', code: '', tableName: '', status: false });
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [page, setPage] = useState(0);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');

//     const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImtpZXQxMjM0NTYiLCJzdWIiOiJraWV0MTIzNDU2IiwiZXhwIjoyMDkwMjkyODc1fQ.ZO7poBtnqN-LOM8cdI2GblU4Kw1DUzDtzVEycJGoJLI"; // Use environment variables


//     useEffect(() => {
//         fetchTables();
//     }, [page]);

//     const fetchTables = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/table?page=${page}`);
//             setTables(response.data);
//         } catch (error) {
//             console.error("Error fetching tables:", error);
//         }
//     };

//     const openModal = (table = { id: '', code: '', tableName: '', status: false }) => {
//         setCurrentTable(table);
//         setIsEditMode(!!table.id);
//         setModalIsOpen(true);
//     };

//     const closeModal = () => {
//         setModalIsOpen(false);
//         setCurrentTable({ id: '', code: '', tableName: '', status: false });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCurrentTable(prev => ({
//             ...prev,
//             [name]: name === 'status' ? value === 'true' : value
//         }));
//     };

//     const saveTable = async () => {
//         try {
//             if (isEditMode) {
//                 await axios.put(`http://localhost:8080/api/table/update/${currentTable.id}`, null, { params: { newStatus: currentTable.status } ,  headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     }
//                 });
//             } else {
//                 await axios.post('http://localhost:8080/api/table/create', currentTable);
//             }
//             fetchTables();
//             closeModal();
//         } catch (error) {
//             console.error("Error saving table:", error);
//         }
//     };

//     const deleteTable = async (id) => {
//         if (window.confirm("Are you sure you want to delete this table?")) {
//             try {
//                 await axios.delete(`http://localhost:8080/api/table/delete/${id}`,{
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 fetchTables();
//             } catch (error) {
//                 console.error("Error deleting table:", error);
//             }
//         }
//     };

//     // Filter tables based on search term and status
//     const filteredTables = tables.filter(table => {
//         const matchesCode = table.code.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && table.status) || (filterStatus === 'inactive' && !table.status);
//         return matchesCode && matchesStatus;
//     });

//     return (
//         <div>
//             <div className="page-background">
//                 <div className="container">
//                     <h3 className="text-left my-4">Danh sách bàn</h3>

//                     <div className="content-wrapper">
//                         <div className="form-container">
//                             <form className="form-inline">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Search by Code"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                                 <select
//                                     className="form-select mt-2"
//                                     value={filterStatus}
//                                     onChange={(e) => setFilterStatus(e.target.value)}
//                                 >
//                                     <option value="all">All Statuses</option>
//                                     <option value="active">Active</option>
//                                     <option value="inactive">Inactive</option>
//                                 </select>
//                             </form>
//                         </div>
//                         {/* Nội dung còn lại */}
//                         <div className="container-table">
//                             <div className="add-button-container">
//                                 <button style={{ borderRadius: 50 }} className="btn btn-add btn-sm" onClick={() => openModal()}>
//                                     <i className="fa-duotone fa-solid fa-circle-plus" />
//                                     Thêm mới bàn
//                                 </button>
//                             </div>

//                             <div className="table-container">
//                                 <table className="table table-hover">
//                                     <thead className="table-light">
//                                     <tr style={{ color: "#dcdcdc" }}>
//                                         <th style={{ color: "#a1a3a3" }} className="table-active">
//                                             STT
//                                         </th>
//                                         <th style={{ color: "#a1a3a3" }} className="table-active">
//                                             Số bàn
//                                         </th>
//                                         <th style={{ color: "#a1a3a3" }} className="table-active">
//                                             Tên
//                                         </th>
//                                         <th style={{ color: "#a1a3a3" }} className="table-active">
//                                             Trạng thái
//                                         </th>
//                                         <th style={{ color: "#a1a3a3" }} className="table-active">
//                                             Hành động
//                                         </th>
//                                     </tr>
//                                     </thead>
//                                     <tbody>
//                                     {filteredTables?.map((item, index) => (
//                                         <tr key={item.id}>
//                                             <td>{item.id}</td>
//                                             <td>{item.code}</td>
//                                             <td>{item.tableName}</td>
//                                             <td>{item.status ? 'Active' : 'Inactive'}</td>
//                                             <td>
//                                                 <button style={{ borderColor: "#bd965f" }} onClick={() => openModal(item)}>
//                                                         <i className="fas fa-pen" style={{ color: "#bd965f", borderColor: "#bd965f" }}/>
//                                                 </button>
//                                                 <button style={{ borderColor: "#bd965f" }} onClick={() => deleteTable(item.id)}>
//                                                     <i className="fas fa-trash" style={{ color: "#bd965f" }} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}

//                                     </tbody>
//                                 </table>
//                                 {/* Modal for Create/Edit Table */}
//                                 <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content">
//                                     <h2 className="text-center">{isEditMode ? 'Edit Table' : 'Create Table'}</h2>
//                                     <div className="mb-3">
//                                         <label className="form-label">Table Code</label>
//                                         <input
//                                             type="text"
//                                             name="code"
//                                             className="form-control"
//                                             placeholder="Table Code"
//                                             value={currentTable.code}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Table Name</label>
//                                         <input
//                                             type="text"
//                                             name="tableName"
//                                             className="form-control"
//                                             placeholder="Table Name"
//                                             value={currentTable.tableName}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Status</label>
//                                         <select
//                                             name="status"
//                                             className="form-select"
//                                             value={currentTable.status}
//                                             onChange={handleInputChange}
//                                         >
//                                             <option value="false">Inactive</option>
//                                             <option value="true">Active</option>
//                                         </select>
//                                     </div>
//                                     <div className="d-flex justify-content-between">
//                                         <button className="btn btn-success" onClick={saveTable}>{isEditMode ? 'Update' : 'Create'}</button>
//                                         <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
//                                     </div>
//                                 </Modal>
//                             </div>
//                             <div className="d-flex justify-content-between">
//                                 <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
//                                 <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>Next</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default TableManagement;