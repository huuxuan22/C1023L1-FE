import axios from "axios";

const URL_PRODUCT = "http://localhost:8080/api/product";
export const getAllProducts = async (page , size, sortBy, sortOrder) => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`${URL_PRODUCT}/getList?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        return response;
    }catch (e) {
        console.log(e.message);
    }
}




export const searchProductsByName = async (name, page, size) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL_PRODUCT}/searchByProductName?productName=${name}&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    }catch (e) {
        console.log(e.message)
    }
}


export const searchProductsByCategory = async (categoryId, page, size) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URL_PRODUCT}/searchByCategory?categoryId=${categoryId}&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
            });
        return response;
    }catch (e) {
        console.log(e.message);
    }
}
export const searchProductByCode = async (productCode) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL_PRODUCT}/searchByProductCode?productCode=${productCode}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }catch (e) {
        console.log(e.message);
    }
}

export const createProduct = async (product) => {
    const token = localStorage.getItem('token');
    console.log("đây là product",product);
    
    try {
        const data = await axios.post(`http://localhost:8080/api/product`, product ,{
            headers: {
                'Authorization': `Bearer ${token}` // Token cần phải tồn tại và hợp lệ
            }
        })
    }catch (e) {
        console.log(e.message)
    }
}


export const getProductById = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URL_PRODUCT}/${id}`, {
            headers:{
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}` // Token cần phải tồn tại và hợp lệ
            }
        })
        return response.data;
    }catch (e) {
        console.log(e.message)
    }
}


export const updateProduct = async (product, id) => {
    
    
    const token = localStorage.getItem('token');
    console.log("đã vào phần update");
    console.log(product);
    console.log(token);
    
    try {
       const data = await axios.patch(`http://localhost:8080/api/product/${id}`,product, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        return data;
    }catch (e) {
        console.log(e.message);
    }
}


export const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`${URL_PRODUCT}/${id}`, {
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }catch (e) {
        console.log(e.message)
    }
}



export const checkProductName = async (productName) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${URL_PRODUCT}/checkProductName?productName=${productName}`, {
            headers:{
                'Content-Type': 'application',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("-----------------------------------------------")
        console.log(response);
        console.log(response.data);
        return response.data;
    }catch (e) {
        console.log("----------------------lỗi --------------")
        console.log(e.message);
    }
}