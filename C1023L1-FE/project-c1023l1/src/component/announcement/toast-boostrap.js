import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastBoostrap = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = () => {
    const newToast = {
      id: Date.now(), // Dùng id duy nhất cho mỗi Toast
      message: 'Đây là một thông báo mới!',
    };
    setToasts([...toasts, newToast]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return (
    <div >
      

      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} onClose={() => removeToast(toast.id)} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Bạn cần đăng nhập lại để thực hiện thao tác này vì bạn không có quyền .</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default ToastBoostrap;
