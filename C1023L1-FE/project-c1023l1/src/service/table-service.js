import axios from "axios";

export const findByTableId = async (token,tableId) => {
    const res = await axios.get(`http://localhost:8080/api/table/${tableId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res.data;
}
export const getAllTables = async (page = 0) => {
    try {
        console.log("đã vào tableservice");
        
        const res = await axios.get(`http://localhost:8080/api/table?page=${page}`);
        console.log("API Response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching tables:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};


// export const remove = async (id) => {
//     try {
//         const response = await axios.delete(`http://localhost:8080/api/table/${id}`, {
//             headers: {
//                 Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImtpZXQxMjM0NTYiLCJzdWIiOiJraWV0MTIzNDU2IiwiZXhwIjoyMDkwMjkyODc1fQ.ZO7poBtnqN-LOM8cdI2GblU4Kw1DUzDtzVEycJGoJLI`,
//             },
//         });
//         if (response.status === 204) {
//             toast.success("Xóa bàn thành công!");
//         }
//         return response.data;
//     } catch (error) {
//         console.error("Error deleting user:", error);
//         toast.error("Lỗi khi xóa bàn: " + error.response?.data?.message || error.message);
//         throw error;
//     }
// };

// export const add= async () =>{
//     try{
//         let response=await axios.add(`http://localhost:8080/api/table/add`);
//         return response.data;
//     }
//     catch (e) {
//         console.log(e);
//     }
// };


// const URL = "http://localhost:8081/api/table/get_table";
// export const getAllTables = async (page, size) => {
//     try {
//         const result = await axios.get(`${URL}?page=${page}&size=${size}`, {
//             headers: {
//                 'Content-Type': "application/json",
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// };