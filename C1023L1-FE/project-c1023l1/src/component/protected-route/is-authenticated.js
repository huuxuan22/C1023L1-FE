import { Navigate, Outlet, Route,redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const isAuthenticated = () => {
    console.log("đã đi vào phần xác thực");
    
    const token = localStorage.getItem('token');
    
    return !token;
}

const ProtectedRouted = ({ children }) => {
    if (isAuthenticated()) {
        
        toast.error("bạn cần đăng nhập@@")
      // Nếu chưa đăng nhập, chuyển hướng về trang giới thiệu (hoặc trang đăng nhập)
         return <Navigate to="" replace />;
    }
  
    // Nếu đã đăng nhập, render các children (component bên trong ProtectedRoute)
    return children ? children : <Outlet />;
  };
  
  export default ProtectedRouted;