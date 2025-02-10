import axios from 'axios';

export const callOrder = async (token, callOrderRequestDto) => {
    console.log("đã đi vào gọi món");
    console.log(callOrderRequestDto);
    
    const tokens  = localStorage.getItem('token');
    const res = await axios.post("http://localhost:8080/api/orders/call-order", callOrderRequestDto, {
        headers: {
            Authorization: `Bearer ${tokens}`,
        }
    });
    return res.data;
};


export const callService = async (tableId, token) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/orders/call-service',
            {tableId: tableId}, // Dữ liệu gửi lên backend
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Token để xác thực
                },
            }
        );
        console.log(response.data);
    } catch (error) {
        console.error('Lỗi khi gọi phục vụ:', error.response ? error.response.data : error.message);
    }
};


export const callBill = async (tableId, token) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/orders/call-bill',
            {tableId: tableId}, // Dữ liệu gửi lên backend
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Token để xác thực
                },
            }
        );
        console.log(response.data);
    } catch (error) {
        console.error('Lỗi khi gọi phục vụ:', error.response ? error.response.data : error.message);
    }
};



export const findProductsByCategory = async ( categoryId, pageable) => {
    console.log("đã đi vào chọn món");
    console.log("categoryId: ",categoryId);
    console.log("pageable: ",pageable);
    
    
    const res = await axios.get(`http://localhost:8080/api/product/category`, {
        params: {
            // Bạn có thể thêm các tham số phân trang vào đây nếu cần
            page: pageable.pageNumber, // Số trang
            size: pageable.pageSize,    // Kích thước trang
            categoryId: categoryId
        },
    });
    return res.data;
};



export const getAllOrderDetails = async (tableId) => {
    const token = localStorage.getItem('token')
    try {
        const result = await axios.get(`${URL}/by-table/${tableId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(result)
        return result;
    } catch (error) {
        console.log(error);
    }
};
export const handleResetTable = async (tableId) => {
    const token = localStorage.getItem('token');
    try {
        const result = await axios.put(`${URL}/reset-status/${tableId}`,{}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return result;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
    }
};

