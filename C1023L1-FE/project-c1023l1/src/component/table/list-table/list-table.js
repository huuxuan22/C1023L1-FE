import React, { useEffect, useState } from 'react';
import './list-table.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tableService from "../../../service/table-service";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'material-icons/iconfont/material-icons.css';
import { useNavigate } from "react-router-dom";

function TableList() {
    const [tables, setTables] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(5);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleTableClick = (tableCode, tableId) => {
        navigate(`/thanhtoans/${tableId}`, { state: { tableCode } });
    };
    useEffect(() => {
        fetchTables(page)
    }, [page]);

    const fetchTables = async (page) => {
        try {
            const result = await tableService.getAllTables(page, size);
            console.log("API Response:", result); // Log the entire response object// Log the content specifically
            if (result) {
                setTables(result.data.content);
                console.log(result.data.content)
                setTotalPages(result.data.totalPages);

            } else {
                setError('No tables data found.');
                setTables([]);
                setTotalPages(1);
            }
            setError(null);

        } catch (err) {
            console.error("Error fetching tables:", err);
            setError('Error fetching tables.');
            setTables([]);
            setTotalPages(1);
        }
    };



    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage); // Change the page if within valid range
        }
    };

    return (
        <div className="container">
            <h1>List Table</h1>
            <div className="table-container">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div key={table.id} className="table-item">
                            <a
                                className="button"
                                onClick={() => handleTableClick(table.code, table.id)}
                            >
                                <i className="material-icons icon">restaurant</i>
                                <p>{table.tableName}</p>
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No tables available.</p> // Fallback UI
                )}
                {/*{tables.length > 0 ? (*/}
                {/*    tables.map((table) => (*/}
                {/*        <div key={table.id} className="table-item">*/}
                {/*            <a*/}
                {/*                className={`button ${table.status ? 'occupied' : 'available'}`} // Change class based on status*/}
                {/*                onClick={() => handleTableClick(table.code, table.id)}*/}
                {/*            >*/}
                {/*                <i className="material-icons icon">restaurant</i>*/}
                {/*                <p>{table.code}</p>*/}
                {/*                <p className="table-status">*/}
                {/*                    {table.status ? "Bàn đã có khách" : "Bàn trống"} /!* Display status message *!/*/}
                {/*                </p>*/}
                {/*            </a>*/}
                {/*        </div>*/}
                {/*    ))*/}
                {/*) : (*/}
                {/*    <p>No tables available.</p> // Fallback UI*/}
                {/*)}*/}
            </div>

            <div className="pagination-container d-flex justify-content-center mt-3">
                <button
                    style={{ backgroundColor: "#bd965f", color: "#f5f5f5" }}
                    className="btn"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>

                <span className="mx-3">Page {page + 1} of {totalPages}</span>

                <button
                    style={{ backgroundColor: "#bd965f", color: "#f5f5f5" }}
                    className="btn"
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default TableList;
