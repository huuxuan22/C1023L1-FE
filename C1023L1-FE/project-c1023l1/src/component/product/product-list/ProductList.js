import React, {useEffect, useState} from "react";
import {
    getAllProducts,
    searchProductsByCategory,
    searchProductsByName,
    searchProductByCode
} from "../../../service/ProductService.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import st from "./list.module.css";
import {Dropdown} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {getAllCategories} from "../../../service/CategoriesService";
import ModalDelete from "../modal-delete/ModalDelete";
import Footer from "../../home/footer/footer.js";
import Header from "../../home/header/header.js";

function ProductList() {
    const [products, setProducts] = useState();
    const [categories, setCategories] = useState([]);
    const [comboCategories, setComboCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(3); // Kích thước trang cố định
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("acs")
    const [isSearching, setIsSearching] = useState(false);
    const [searchResponse, setSearchResponse] = useState("");
    const [show, setShow] = useState(false);
    const [product, setProduct] = useState();
    const [categoryId, setCategoryId] = useState();
    const [searchCriterion, setSearchCriterion] = useState(null);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('roles')

    useEffect(() => {
        try {
            console.log(isSearching)
            if (isSearching) {
                if (searchCriterion === "name") {
                    getProductsByName();
                } else if (searchCriterion === "code") {
                    getProductByCode();
                } else if (searchCriterion === "category") {
                    handleCategoryClick(categoryId);
                }
            } else {
                getProducts(currentPage, sortBy, sortOrder)
            }
        } catch (e) {
            console.log(e);
        }
        console.log(products)
    }, [currentPage, sortBy, sortOrder, isSearching, name, categoryId, code]);


    useEffect(() => {
        getAllCategories().then((data) => {
            setCategories(data);
        })
    }, [])
    useEffect(() => {
        const filteredCategories = categories.filter(category =>
            category.categoryName.toLowerCase().includes("combo")
        );
        setComboCategories(filteredCategories)
        console.log(comboCategories)
    }, [categories])
    const getProductsByName = () => {
        setSearchCriterion("name");
        setIsSearching(true);
        searchProductsByName(name, currentPage, pageSize).then((response) => {
            const {content, totalPages} = response.data;
            if (content) {
                setProducts(content);
                setTotalPages(totalPages);
                setSearchResponse("");
            } else {
                setProducts([]);
                setTotalPages(1);
                setSearchResponse("Product not available");
            }
            console.log(response.data)
        })
    }
    const getProductByCode = () => {
        setSearchCriterion("code");
        setIsSearching(true);
        searchProductByCode(code).then((data) => {
            if (data) {
                setProducts([data]);
                setSearchResponse("");
            } else {
                setProducts([]);
                setTotalPages(1);
                setSearchResponse("Product not available");
            }
            console.log(data)
        })
    }

    const getProducts = (page, sortBy, sortOrder) => {
        setIsSearching(false);
        getAllProducts(page, pageSize, sortBy, sortOrder).then((response) => {
            const {content, totalPages} = response.data;
            setProducts(content);
            setTotalPages(totalPages);
            setSearchResponse("");
            console.log(response.data)
            console.log(comboCategories)
        })
    }
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    //tim kiem theo category
    const handleCategoryClick = (categoryId) => {
        setSearchCriterion("category");
        setIsSearching(true);
        if (categoryId === null) {
            getProducts(currentPage, sortBy, sortOrder);
        } else {
            searchProductsByCategory(categoryId, currentPage, pageSize).then((response) => {
                const {content, totalPages} = response.data;
                setProducts(content);
                console.log(content)
                setTotalPages(totalPages);
                setSearchResponse("");
            }).catch((e) => {
                console.log("Error fetching products by category: ", e);
            })
        }
    }
    const handleSortChange = (newSortBy) => {
        setIsSearching(false);
        // thay doi order
        const newSortOrder = (newSortBy === sortBy && sortOrder === "acs") ? "decs" : "acs";
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        getProducts(currentPage, newSortBy, newSortOrder);
    }
    //xoa product
    const handleSHow = (item) => {
        setProduct(item);
        setShow(true);
    }

    if (!products) {
        return <p>Loading...</p>;
    }
    // Example of a debounced search handler for name search
    const handleSearchByName = debounce(() => {
        setCurrentPage(0);
        getProductsByName();
    }, 300);

// Debounce function
    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }



    if (!products && !searchResponse) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <Header roles={role} token={token}/>
            <div className={st["outer-div-1"]}>
            <h3 className={st["container-1"]}>Product Management</h3>
            <div className={`${st["container-1"]} mt-5 ${st["list"]}`}>
                <div className="d-flex justify-content-between">
                    <h5 style={{marginLeft: 'auto'}}>
                        <Link to="/category" className={`btn btn-primary ${st["btn-create-1"]}`} style={{
                            borderRadius: '50px',
                            border: 'none',
                            backgroundColor: '#bd965f',
                            color: '#f5f5f5',
                            marginRight: '10px'
                        }}>
                            <i className="fa-solid fa-bars" style={{color: '#f5f5f5'}}></i> Category
                        </Link>
                        <Link to="/create" className={`btn btn-primary ${st["btn-create-1"]}`} style={{
                            borderRadius: '50px',
                            border: 'none',
                            backgroundColor: '#bd965f',
                            color: '#f5f5f5'
                        }}>
                            <i className="fa-solid fa-circle-plus" style={{color: '#f5f5f5'}}></i> Create Product
                        </Link>
                    </h5>
                </div>

                {/*Tabs*/}
                <ul className={`nav nav-tabs`}>
                    <li className="nav-item">
                        <button className={"nav-link"} onClick={() => handleCategoryClick(null)}>
                            All Products
                        </button>
                    </li>
                    {comboCategories.map(category => (
                        <li className="nav-item" key={category.categoryId}>
                            <button className={"nav-link"}
                                    onClick={() => {
                                        handleCategoryClick(category.categoryId);
                                        setCurrentPage(0);
                                        setCategoryId(category.categoryId);
                                    }}>{category.categoryName}</button>
                        </li>
                    ))}
                </ul>

                {/* Filter and Search */}
                <div className={`${st["filter-section-1"]} d-flex justify-content-between align-items-center mt-3`}>
                    {/*Filter buttons*/}
                    <div className="d-flex align-items-center ">
                        <div className={`dropdown me-3 ${st["list"]}`}>
                            <button className="btn btn-light dropdown-toggle" type="button" id="statusDropdown"
                                    data-bs-toggle="dropdown">
                                Category
                            </button>
                            <ul className={`dropdown-menu `}>
                                <li>
                                    <button className={`dropdown-item `} onClick={() => handleCategoryClick(null)}>
                                        All Products
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.categoryId}>
                                        <button className={`dropdown-item `} onClick={() => {
                                            handleCategoryClick(category.categoryId);
                                            setCurrentPage(0);
                                            setCategoryId(category.categoryId);
                                        }}>
                                            {category.categoryName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="input-group me-3">
                            <span className={`input-group-text bg-white border-end-0 ${st["search-hover-1"]}`} id="search-icon">
                                <i className="bi bi-search"></i>
                            </span>
                            <input type="text" className={`form-control search-input-1 border-start-0 ${st["search-hover-1"]}`}
                                   placeholder="Search By Name" aria-label="Search"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                           setName(e.target.value);
                                           setCurrentPage(0);
                                           getProductsByName();
                                       }
                                   }}
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 search-hover-1" id="search-icon">
                                <i className="bi bi-search"></i>
                            </span>
                            <input type="text" className={`form-control search-input-1 border-start-0 ${st["search-hover-1"]}`}
                                   placeholder="Search By Code" aria-label="Search"
                                   value={code}
                                   onChange={(e) =>
                                       setCode(e.target.value.trim())
                                   }
                                   onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                           setCode(e.target.value);
                                           setCurrentPage(0);
                                           setTotalPages(1);
                                           getProductByCode();
                                       }
                                   }}

                            />
                        </div>

                        <div className={`${st["view-options-1"]} ms-3 ${st["list"]}`}>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="link"
                                    id="dropdown-basic"
                                    className={st["btn-sort-1"]}
                                    style={{color: 'inherit', border: 'none'}}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#bd965f'; // Thay đổi màu khi hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'inherit'; // Đặt lại màu khi không hover
                                    }}
                                >
                                    <i className="bi bi-list"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item className={`dropdown-item `}
                                                   onClick={() => handleSortChange("productCode")}>
                                        Sort by code
                                    </Dropdown.Item>
                                    <Dropdown.Item className={`dropdown-item `}
                                                   onClick={() => handleSortChange("productName")}>
                                        Sort by name
                                    </Dropdown.Item>
                                    <Dropdown.Item className={`dropdown-item `}
                                                   onClick={() => handleSortChange("productPrice")}>
                                        Sort by price
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="link"
                                    id="dropdown-basic"
                                    className={`${st["btn-sort-1"]} ${st["list"]}`}
                                    style={{color: 'inherit', border: 'none'}}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#bd965f'; // Thay đổi màu khi hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'inherit'; // Đặt lại màu khi không hover
                                    }}
                                >
                                    <i className="bi bi-grid"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item className={`dropdown-item ${st["list"]}`} onClick={() => {
                                        setSortOrder("asc");
                                        setIsSearching(false);
                                    }}>Ascending</Dropdown.Item>
                                    <Dropdown.Item className={`dropdown-item ${st["list"]}`} onClick={() => {
                                        setSortOrder("Desc");
                                        setIsSearching(false);
                                    }}>Descending</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <table className={`table table-hover ${st["list"]}`}>
                    <thead>
                    <tr className={st["title-1"]}>
                        <th style={{color: '#a1a3a3'}} onClick={() => handleSortChange("productCode")}>
                            Code <i className={`bi bi-caret-${sortOrder === "asc" ? "up" : "down"}`}></i>
                        </th>
                        <th style={{color: '#a1a3a3'}} onClick={() => handleSortChange("productName")}>
                            Name <i className={`bi bi-caret-${sortOrder === "asc" ? "up" : "down"}`}></i>
                        </th>
                        <th style={{color: '#a1a3a3'}} onClick={() => handleSortChange("productPrice")}>
                            Price <i className={`bi bi-caret-${sortOrder === "asc" ? "up" : "down"}`}></i>
                        </th>
                        <th style={{color: '#a1a3a3'}}>Category</th>
                        <th style={{color: '#a1a3a3'}}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products && products.map((item) => {
                        const copiedPrd = {...item};
                        return (
                            <tr key={copiedPrd.productId}>
                                <td>{copiedPrd.productCode}</td>
                                <td>{copiedPrd.productName}</td>
                                <td>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(copiedPrd.productPrice)}
                                </td>
                                <td>{copiedPrd.category ? copiedPrd.category.categoryName : "N/A"}</td>
                                <td className={st["list"]}>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="link"
                                            id="dropdown-basic"
                                            className={st["btn-dots-1"]}
                                            style={{
                                                border: 'none',
                                                borderRadius: '50px',
                                                backgroundColor: 'white',
                                                color: '#a1a3a3',
                                                padding: '0.5rem',
                                            }}
                                        >
                                            <i className="bi bi-three-dots"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item className="dropdown-item" as={Link}
                                                           to={`/productDetail/${item.productId}`}>
                                                Detail <i className={`fa-solid fa-circle-info ${st["icon-hover-1"]}`}></i>
                                            </Dropdown.Item>
                                            
                                            <Dropdown.Item className="dropdown-item" as={Link}
                                                           to={`/product/${item.productId}`}>
                                                Update <i className={`fa-solid fa-pen-to-square ${st["icon-hover-1"]}`}></i>
                                            </Dropdown.Item>

                                            <Dropdown.Item className="dropdown-item"
                                                           onClick={() => handleSHow(item)}>
                                                Delete <i className={`fa-solid fa-trash-can ${st["icon-hover-1"]}`}></i>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {/* Nút chuyển trang */}
                <div className="pagination">
                    <button
                        style={{backgroundColor: "#bd965f", color: "#f5f5f5"}}
                        className={`btn ${st["btn-page"]}`}
                        disabled={currentPage === 0}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>

                    <span className="mx-3">Page {currentPage + 1} of {totalPages}</span>

                    <button
                        style={{backgroundColor: "#bd965f", color: "#f5f5f5"}}
                        className={`btn ${st["btn-page"]}`}
                        disabled={currentPage === totalPages - 1}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                    <span className="mx-3">{searchResponse}</span>
                    {product && (
                        <ModalDelete
                            show={show}
                            setShow={setShow}
                            product={product}
                            currentPage={currentPage}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            getProducts={getProducts}
                        />
                    )}
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    )
}

export default ProductList;
