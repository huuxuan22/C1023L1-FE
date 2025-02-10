import { useState } from "react";
import styles from "./vefiry-code.module.css"; // Import CSS Module
import * as userService from "./../../service/UserService"
import { useLocation, useNavigate } from "react-router-dom";
const VerifyCode = () => {
    const [inputCode, setInputCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [inputError, setInputError] = useState([false, false, false, false, false, false]);
    const location = useLocation();
    const inf = location.state;
    const navigate = useNavigate()
    // Xử lý thay đổi input
    const handleInputChange = (value, index) => {
        if (!/^\d*$/.test(value)) {
            setError("Chỉ được phép nhập ký tự số");
            return;
        }

        const newInputCode = [...inputCode];
        newInputCode[index] = value;

        if (value && index < 5) {
            document.getElementById(`input-${index + 1}`).focus();
        }

        setInputCode(newInputCode);
        setError('');
    };

    // Xử lý submit
    const handleSubmit =async (e) => {
        e.preventDefault();
        const newInputCodeString = inputCode.join('');
        if (newInputCodeString.length < 6) {
            setError('Vui lòng nhập đầy đủ mã');
            setInputError(inputCode.map(input => input === ''));
            return;
        }
        try {
            const response = await userService.GetCode(newInputCodeString, inf.email).then(() => {
                if (response) {
                    navigate('/create-new-password', {state: inf})
                } else {
                    setError("Mã code bạn nhập không chính xác"); // Sử dụng thông điệp lỗi từ backend
                    setInputError(inputCode.map(input => input === ''));
                    return;
                }
            }); 
            console.log(inf);
            
            // Kiểm tra phản hồi từ backend
            
        } catch (error) {
            console.log(error); // Log lỗi để dễ dàng debug
            setError("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
    };

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyForm}>
                <h2>Nhập mã xác thực</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        {inputCode.map((digit, index) => (
                            <input
                                key={index}
                                id={`input-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleInputChange(e.target.value, index)}
                                maxLength={1}
                                className={`${styles.verifyInput} ${inputError[index] ? styles.errorShake : ''} ${inputError[index] ? styles.error : ''}`}
                            />
                        ))}
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button type="submit" className={styles.verifyBtn}>Xác nhận</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyCode;
