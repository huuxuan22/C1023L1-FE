import React from 'react';
import styles from './header-order-detail.module.css'; // Import module CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => (
    <div className={styles.header}>
        <i className="fa-solid fa-bars"></i>
        <div className={styles.labelHeader}>
            <h4>Trang Chủ</h4>
        </div>
        <div className={styles.search}>
            <i className="fa-solid fa-magnifying-glass"></i>
        </div>
    </div>
);

export default Header;
