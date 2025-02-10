import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './order-modal.module.css'; // Import CSS module

function OrderModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Không cần setShow nữa vì chúng ta sử dụng trực tiếp isOpen để kiểm soát việc mở/modal
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered className={styles.modalContent}>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Welcome Cafe-Management</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        {/* Hình ảnh quản lý cà phê */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <img
            src="https://th.bing.com/th/id/OIP.9tzZR5sARIYEjsy28Y1HQQHaE8?w=237&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Thay link này bằng URL hình ảnh của bạn
            alt="Quản lý cà phê"
            className={styles.modalImage}
          />
        </div>
        <p>Bạn có muốn order luôn không?</p>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <Button variant="secondary" onClick={onClose} className={styles.secondary}>
          Để sau
        </Button>
        <Button variant="primary" onClick={() => {
          navigate('/tables');
          onClose();  // Đóng modal sau khi đã order
        }} className={styles.primary}>
          Order ngay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderModal;
