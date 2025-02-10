import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Sử dụng react-router-dom để điều hướng
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import * as userService from "./../../service/UserService";
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../home-page/Layout';
import Header from '../home/header/header';
import Footer from '../home/footer/footer';
import { faKey, faLock, faUser } from '@fortawesome/free-solid-svg-icons';


/**
 * cho phép người dùng đăng nhập
 * @returns JSX Component
 */
const Login = () => {
  
  const navigate = useNavigate();
  const schema = Yup.object().shape({
    username: Yup.string().required("Bạn chưa nhập username"),
    password: Yup.string().required("bạn chưa nhập mật khẩu")
  })
  const { register, handleSubmit,setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
}); 

    const token = localStorage.getItem('token');

    

  
    // đăng nhập với google
  const handleGoogleLogin = () => {
    alert("Đăng nhập với Google thành công!");
  };

  // đăng nhập với facebook
  const handleFacebookLogin = () => {
    alert("Đăng nhập với Facebook thành công!");
  };

  // đăng nhập thành công
  const onSubmit =async (data) => {
      const respone =await userService.Login(data.username,data.password); // thực hiện service

      // trả về các lỗi tương ứng
      if (respone === 400) {
         toast.success('tài khoản của bạn đã chưa cập nhật 30 ngày cần phải thay đổi lại')
      } else if (respone === 404) {
          console.log('đã đi vào trong này');
          setError('username',{
            type: 'server',
            message: 'tài khoản này không tồn tại'
        })

        
      }else if (respone === 500) {
          setError('password', {
            type: 'server',
            message: 'mật khẩu không không đúng '
          })
      }else {
        // đã check thành công và trả về token
        const role = JSON.parse(localStorage.getItem('roles'));
        console.log(role.roleName);
        
        if ( role.roleName === "ROLE_OWNER") {
           console.log("đi qua trang quản lý admin");
            navigate('/admin')
        }else if ( role.roleName === "ROLE_USER"){
            console.log("ĐI qua trang user");
            navigate('/userprofile')
        }else if (role.roleName === "ROLE_ADMIN"){
          console.log("đi qua trang admin");
          console.log(role.roleName);
          
          navigate('/product')
        }
        // trả về token 
        console.log("đã đăng nhập và sẽ đi qua hôme"); 
      }
      
      
  }


  return (
    <div>
      <Header/>
         <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
      <div className={styles.loginHeader}>
  <FontAwesomeIcon icon={faKey} className={`${styles.icon} ${styles.iconAnimate}`} />
  <h2 className={`${styles.headerText} ${styles.headerTextAnimate}`}>Login</h2>
</div>

        <form
           onSubmit={handleSubmit(onSubmit)}

           >
             
             <div className={`${styles.formGroup} ${styles.formInput}`}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                <input
                  type="text"
                  className={`${styles.formControl} ${errors.username ? styles.error : ''}`}
                  placeholder="Username"
                  aria-label="username"
                  {...register('username')}
                />
              </div>
              {errors.username && <p className={styles.displayErrors}>{errors.username.message}</p>}
            </div>

          

            <div className={`${styles.formGroup} ${styles.formInput}`}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <input
                  type="password"
                  className={`${styles.formControl} ${errors.password ? styles.error : ''}`}
                  placeholder="Password"
                  aria-label="password"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className={styles.displayErrors}>{errors.password.message}</p>}
            </div>
         
          <button type="submit" className={styles.btnSubmit}>Login</button>
        </form>
        <div className={styles.formGroup}>
          <Link to='/forgot-password' className={styles.forgotPasswordLink}>
            Quên mật khẩu
          </Link>
        </div>


        <div className={styles.socialLogin}>
          <p>Or login with</p>
          <button 
              id="googleLogin" 
              className={`${styles.socialBtn} ${styles.googleBtn}`}
              onClick={handleGoogleLogin}
            >
          <FontAwesomeIcon icon={faGoogle} />Login with Google
          </button>
          <button 
              id="facebookLogin" 
              className={`${styles.socialBtn} ${styles.facebookBtn}`} 
              onClick={handleFacebookLogin}
            >
            <FontAwesomeIcon icon={faFacebook} /> Login with Google
          </button>
        </div>

        <div className={styles.registerLink}>
          <div>
            <p>Bạn chưa có tài khoản?</p>
          </div>
          <div>
            <Link to="/register" className={styles.registerBtn}>Đăng ký</Link> 
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};
export default Login;
