import axios from "axios";

export const getProductsHasPromotion = async (page, size) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/promotion/getAllProduct?page=${page}&size=${size}`, {
                header:{
                    'Content-Type':'application/json'
                }
            });
        return res;
    } catch (e) {
        console.log(e);
    }
};
export const getNewestProducts = async () => {
    try {
        const res = await axios.get
        ( "http://localhost:8080/api/home/option");
        return res;
    } catch (e) {
        console.log(e);
    }
};
export const searchProduct = async (name, page) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/home/productName?productName=${name}&page=${page}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
export const searchProductByPromotion = async (size, page) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/promotion/getAllProduct?int=${size}&page=${page}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
export const searchProductByCategory = async (categoryName) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/home/category?categoryName=${categoryName}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

