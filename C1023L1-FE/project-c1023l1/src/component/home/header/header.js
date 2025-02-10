import { FaQuestionCircle, FaRegBell, FaSignOutAlt, FaUser, FaUserPlus, FaBell, FaFileInvoice } from "react-icons/fa";
import styles from "./header.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "./../../../service/UserService";

function Header({ token, roles }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        userService.logout();
    };

    const role = JSON.parse(localStorage.getItem('roles'));

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.logo}>MyWebsite</div>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link href="#">About</Link></li>
                        <li><Link href="#">Services</Link></li>
                        <li><Link to='/menu'>Let's Order</Link></li>
                    </ul>
                </nav>

                {/* Đăng nhập, đăng ký, hỗ trợ, thông báo */}
                <div className={styles.headerRight}>
                    <ul className={styles.navList}>
                    <li><a href="#" className={styles.supportLink}><FaQuestionCircle /> Hỗ trợ</a></li>
                    <li><a href="#" className={styles.FaBell}><FaBell /> Thông báo </a></li>
                    <li><Link to='/bill' className={styles.notificationLink}><FaFileInvoice /> Bill</Link></li>
                        {!token ? (
                            <>
                                <li><Link to="/login" className={styles.authLink}><FaUser /> Đăng nhập</Link></li>
                                <li><Link to="/register" className={styles.authLink}><FaUserPlus /> Đăng ký</Link></li>
                            </>
                        ) : (
                            <li><Link className={styles.notificationLink} onClick={handleLogout}><FaSignOutAlt /> Đăng xuất</Link></li>
                        )}
                        {role && role.roleName === 'ROLE_ADMIN' && (
                            <li><Link to="/tables" className={styles.authLink}><FaBell /> Gọi bàn</Link></li>
                        )}
                    </ul>
                </div>
            </header>
        </div>
    );
}

export default Header;
