import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// ProtectedRoute kiểm tra trạng thái xác thực mã trước khi cho phép truy cập vào route
const ProtectedRouteWithForgotPassword = ({ children }) => {
    
    const isVerified = localStorage.getItem('isVerified'); // Kiểm tra trạng thái xác thực mã từ localStorage
    if (!isVerified) {
        toast.error("Bạn cần nhập email để tìm tài khoản ")
        return <Navigate to="/forgot-password" />; // Nếu chưa xác thực, điều hướng về trang xác thực mã
    }
    return children; // Nếu đã xác thực, cho phép vào trang yêu cầu
};

export default ProtectedRouteWithForgotPassword;