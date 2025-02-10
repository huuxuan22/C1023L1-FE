import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ask-account.module.css";
import { useState } from "react";
import * as userService from "./../../service/UserService"
const AskAccount = () => {
    const location = useLocation();
    const infor = location.state;
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault(); // Ngừng sự kiện mặc định để không reload trang
        console.log("tôi là xuân");
        console.log(infor.email);
        userService.SendCodeEmail(infor.email).then(() => {
            // Mở modal khi nhấn nút
            navigate('/vefiry-code', {state: infor})
        })
        
    };

    return (
        <div>
            <div className={styles.changPasswordContainer}>
                <div className={styles.changeBox}>
                    <form onSubmit={handleClick}>
                        <h2> Is this your account? </h2>
                        <p>
                            Account: {infor?.username || "Đang tải..."}
                            <br />
                            Name: {infor?.fullName || "Đang tải..."}
                        </p>
                        <button type="submit" className={styles.btnSubmit}>Xác nhận hoàn tất</button>
                    </form>
                </div>
            </div>

            
        </div>
    );
}

export default AskAccount;
