import React, { useEffect, useState } from "react";
import * as TableService from "../../../service/table-service"; // Import service để gọi API
import styles from "./table-list.module.css";
import { useNavigate } from "react-router-dom";

const TableList = ({ onSelectTable }) => {
  const [tables, setTables] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables(); // Gọi hàm để lấy danh sách bàn
  }, [page]); // Gọi lại khi page thay đổi

  const fetchTables = async () => {
    try {
      const response = await TableService.getAllTables(page);
      console.log(tables);
      
      const data = response.content || [];
      setTables(response);
      console.log(tables.status);
      
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setTables([]);
    }
  };

  const handleSelectTable = (table) => {
    const selectedTableData = { tableId: table.id, tableName: table.tableName };
    console.log("Selected Table Data:", selectedTableData); // Kiểm tra dữ liệu trước khi gửi
    // onSelectTable(selectedTableData); // Gửi thông tin bàn đã chọn
    navigate("/menu",{state: selectedTableData});
  };

  return (
    <div>
      <h5>Danh sách bàn</h5>
      <div className={styles.cardContainer}>
        {tables.length > 0 ? (
          tables.map((table) => (
            <div
              key={table.id}
              className={styles.card}
              onClick={() => handleSelectTable(table)} // Thêm sự kiện click để chuyển trang
            >
              <div className={styles.cardImageContainer}>
                <img
                  src={table.image || "https://th.bing.com/th/id/OIP.6llyO2V8YRWaygkfAti_9QHaE8?rs=1&pid=ImgDetMain"}
                  alt={table.tableName}
                  className={styles.cardImage}
                />
              </div>
              <h5 className={styles.cardTitle}>{table.tableName}</h5>
              <p className={styles.cardText}>
                Trạng thái: {table.status === false ? "Chưa có mô tả" : "hết bàn"}
              </p>
              <button className={styles.cardButton}>Chọn bàn</button>
            </div>
          ))
        ) : (
          <div className={styles.card}>
            <p>Không có bàn nào để hiển thị.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div>
        <button
          className={`${styles.btn1} btn btn-secondary`}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Trang trước
        </button>
        <span className="mx-2">
          Trang {page + 1} trên {totalPages}
        </span>
        <button
          className={`${styles.btn1} btn btn-secondary`}
          onClick={() =>
            setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
          }
          disabled={page + 1 >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default TableList;
