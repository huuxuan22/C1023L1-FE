import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import * as feedbackService from "../service/FeedbackService";
import 'bootstrap/dist/css/bootstrap.min.css';
import './feedbacks/FeedbackList.css';
import { getFeedbacksByDate } from "../../service/feedback-service";

function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [dayCreate, setDayCreate] = useState("");
    const [size, setSize] = useState(2);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    // Trigger search or fetch all on dayCreate change
    // useEffect(() => {
    //     if (isSearching && dayCreate) {
    //         handleSearch();
    //     } else {
    //         fetchFeedbacks(page);
    //     }
    // }, [dayCreate]); // Depend on dayCreate only to avoid re-triggering on page change

    useEffect(() => {
        if (!isSearching) {
            fetchFeedbacks(page);
        }
    }, [page]);

    // Fetch all feedbacks without filters
    const fetchFeedbacks = async (page) => {
        try {
            const result = await feedbackService.getAllFeedbacks(page, size);
            setFeedbacks(result.data.content);
            setTotalPages(result.data.totalPages);
            setError(null);
        } catch (err) {
            setError('Error fetching feedbacks.');
            setFeedbacks([]);
            setTotalPages(1);
        }
    };

    // Search feedbacks filtered by date
    const handleSearch = async () => {
        if (!dayCreate) {
            alert("Vui lòng chọn ngày để tìm kiếm.");
            return;
        }

        setIsSearching(true);
        setPage(0); // Reset page to the first page for new search
        setError(null);

        try {
            const result = await getFeedbacksByDate(dayCreate, 0, size); // Start from page 0
            const { content, totalPages } = result.data;
            console.log(result.data);
            setFeedbacks(result.data);
            if (result.totalPages == null){
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setError("Không thể tìm thấy phản hồi với ngày đã chọn.");
            setFeedbacks([]);
            setTotalPages(1);
        }
    };

    // Handle page navigation
    const handlePageChange = async (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);

            try {
                const result = isSearching
                    ? await getFeedbacksByDate(dayCreate, newPage, size)  // Fetch search results
                    : await feedbackService.getAllFeedbacks(newPage, size); // Fetch all results

                const { content } = result.data;
                setFeedbacks(content);
            } catch (error) {
                console.error("Error loading page:", error);
                setError("Unable to load data for this page.");
            }
        }
    };

    if (!feedbacks) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container my-4">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="btn btn-light" aria-current="page" href="/">
                                    <FontAwesomeIcon icon={faHouse} /> Home
                                </a>
                            </li>
                        </ul>
                        <form className="d-flex align-items-center">
                            <label className="me-2">Date Feedback:</label>
                            <input
                                className="form-control me-2"
                                type="date"
                                value={dayCreate}
                                onChange={(e) => setDayCreate(e.target.value)}
                            />
                            <button className="btn btn-search" type="button" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <h1 className="text-center mt-4">List Feedback</h1>

            <div className="table-responsive mt-3">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th style={{ width: '5%' }}>STT</th>
                        <th style={{ width: '15%' }}>Code</th>
                        <th style={{ width: '15%' }}>Date feedback</th>
                        <th style={{ width: '15%' }}>Name Customer</th>
                        <th style={{ width: '15%' }}>Email</th>
                        <th style={{ width: '35%' }}>Content</th> {/* Cột Content chiếm nhiều không gian hơn */}
                    </tr>
                    </thead>
                    <tbody>
                    {/*{feedbacks.length > 0 ? (*/}
                    {/*    feedbacks.map((feedback, index) => (*/}
                    {/*        <tr key={feedback.id}>*/}
                    {/*            <td>{(page * size) + index + 1}</td>*/}
                    {/*            <td>{feedback.feedbackCode}</td>*/}
                    {/*            <td>{feedback.dayCreate}</td>*/}
                    {/*            <td>{feedback.nameCustomer}</td>*/}
                    {/*            <td>{feedback.emailCustomer}</td>*/}
                    {/*            <td>{feedback.content}</td>*/}
                    {/*        </tr>*/}
                    {/*    ))*/}
                    {/*) : (*/}
                    {/*    <tr>*/}
                    {/*        <td colSpan="6">Không có phản hồi nào được tìm thấy.</td>*/}
                    {/*    </tr>*/}
                    {/*)}*/}
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback, index) => {
                            const feedbackCode = `FB-${String(index + 1).padStart(2, '0')}`;

                            return (
                                <tr key={feedback.id}>
                                    <td>{(page * size) + index + 1}</td>
                                    <td>{feedbackCode}</td> {/* Hiển thị mã tự động tạo */}
                                    <td>{feedback.dayCreate}</td>
                                    <td>{feedback.nameCustomer}</td>
                                    <td>{feedback.emailCustomer}</td>
                                    <td>{feedback.content}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6">Không có phản hồi nào được tìm thấy.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
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

export default FeedbackList;
