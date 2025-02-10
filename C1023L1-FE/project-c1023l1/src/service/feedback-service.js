
import axios from 'axios';

export const addFeedBack = async (feedbackData) => {
    const res = await axios.post("http://localhost:8080/api/feedbacks", feedbackData, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return res.data;
};

const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImtpZXQxMjM0NTYiLCJzdWIiOiJraWV0MTIzNDU2IiwiZXhwIjoxNzMzNzE3NDI4fQ.FRsBZG0gD4DErrRT9t5DzYvlUOQQm9IewTCooFd3Jfc";
const URL = "http://localhost:8081/api/feedbacks";
export const getAllFeedbacks = async (page, size) => {
    try {
        const result = await axios.get(`${URL}?page=${page}&size=${size}`, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
};

 export const getFeedbacksByDate = async (date, page, size) => {
        try {
            const result = await axios.get(`${URL}/search/day-create/${date}?page=${page}&size=${size}`, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(result);
            return result;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};