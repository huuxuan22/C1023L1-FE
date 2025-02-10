import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const hasPermission = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

const isTokenValid = (token) => {
  return token !== null && token !== '';
};

const ProtectedRoute = ({ requiredRole }) => {
  
  const role = JSON.parse(localStorage.getItem("roles"));
  const token = localStorage.getItem("token");
  const user = localStorage.getItem('user');
  
  

  if (!token) {
    toast.error("Bạn không có quyền thực hiện chức năng này hoặc bạn chưa đăng nhập");
    window.location.href = "/login";
  }
  
  
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [hasToastBeenShown, setHasToastBeenShown] = useState(false); // State to track if toast has been shown
  const navigate = useNavigate(); // Hook để điều hướng

  useEffect(() => {
    if (!isTokenValid(token) || !hasPermission(role?.roleName, requiredRole)) {
      if (!hasToastBeenShown) {  // Kiểm tra nếu toast chưa được hiển thị
        toast.error("Bạn không có quyền thực hiện chức năng này hoặc bạn chưa đăng nhập");
        setHasToastBeenShown(true);  // Đánh dấu đã hiển thị toast
      }
      setIsAuthorized(false);
      navigate('')
    } else {
      setIsAuthorized(true);
      setHasToastBeenShown(false);  // Reset lại khi người dùng được cấp quyền
    }
  }, [role, token, requiredRole, hasToastBeenShown, navigate]);  // Thêm `navigate` vào dependency array

  return isAuthorized ? <Outlet /> : <Navigate to='/login'/> ;
};

export default ProtectedRoute;
