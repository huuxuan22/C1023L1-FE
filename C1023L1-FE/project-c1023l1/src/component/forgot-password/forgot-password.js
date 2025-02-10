import styles from "./forgot-password.module.css";
import * as Yup from "yup";
import {useForm} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import * as userService from "./../../service/UserService"
const ForgotPassword = () => {
    const navigate = useNavigate();
    const shema = Yup.object().shape({
        email: Yup.string()
            .required("Email không được để trống")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Email không hợp lệ'
            ),
    })
    const {register, handleSubmit, setError, formState: {errors}} = useForm({
        resolver: yupResolver(shema)
    });

    const onSubmit =async (data) => {
        const response =await userService.findUserByEmail(data.email);
        console.log("respone: "+response);
        if (response.status === 404) {
            console.log("đã hiển thị lỗi");
            
            setError('email', {
                type: 'server',
                message: "email này chưa được đăng ký"
            });
        } else {
            // Handle the case when the user is found
            
            console.log("User found:", response);
            navigate('/ask-account', {state: response});
        }
    }


  return (
    <div>
      <div className={styles.changPasswordContainer}>
        <div className={styles.changeBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>FORGOT PASSWORD</h2>

            <p>
              Hãy nhập mật khẩu để tìm tài khoản
            </p>

            <div className={`${styles.formGroup} ${styles.formInput} `}>
              <label htmlFor="username">mật khẩu cũ:</label>
              <input
                type="text"
                className={`${styles.formControl} ${errors.fullName ? styles.error : ''}`}
                placeholder="mật khẩu cũ"
                aria-label='mật khẩu cũ'  
                {...register('email')} 
              />
              {errors.email && (
                <p className={styles.displayErrors} style={{ color: "red" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            

            <div>
              <Link to="/register" className={styles.btnGetout}>
                <FontAwesomeIcon icon={faRotateLeft} /> Trở lại
              </Link>
              <button type="submit" className={styles.btnSubmit}>
                xác nhận hoàn tất
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
