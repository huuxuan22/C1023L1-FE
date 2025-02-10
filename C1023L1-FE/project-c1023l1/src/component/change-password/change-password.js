    import { Link, useNavigate } from "react-router-dom";
    import styles from "./change-password.module.css"
    import * as Yup from "yup"
    import { yupResolver } from "@hookform/resolvers/yup";
    import { useForm } from "react-hook-form";
    import * as userService from "../../service/UserService"
    import { toast } from "react-toastify";
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';


    /**
     * đây là component thay đổi mật khẩu 
     * @returns JSX Component
     */
    const ChangePassword = () => {
        // hook điều hướng
        const navigate = useNavigate();

        // cấu hình Validation form với Yup
        const shema = Yup.object().shape({
            oldPassword: Yup.string()
                .required("Password không được để trống")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/,
                    "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt"
                ),
            newPassword: Yup.string()
                .required("Password không được để trống")
                .notOneOf([Yup.ref('oldPassword')], "Bạn đã sử dụng mật khẩu cũ")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/,
                    "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt"
                ),

            confirmPassword: Yup.string()
                .required("Xác nhận mật khẩu không được để trống")
                .oneOf([Yup.ref('newPassword')], "Mật khẩu xác nhận không khớp"),
        })


        // khởi tạo useForm với Yup resolver
        const { register, handleSubmit,setError, formState: { errors } } = useForm({
            resolver: yupResolver(shema)
        });

        /**
         * xử lý khi người dùng submit
         * @param {*} data dữ liệu form bao gồm các trường oldPassword, newPassword, confirmNewPassword
         */
        const onSubmit =async (data) => {

            // gửi yêu cầu thay đổi mật khẩu tới service
            const respone =await  userService.changePassword(data.oldPassword,data.newPassword);
            console.log(respone.status);
            

            // xử lý lỗi trả về từ server
            if (respone.status === 400 && Array.isArray(respone.data.errorMessages)) {
                setError('newPassword',{
                    type: 'server',
                    message: "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt"
                })
            } else if (respone === 400) {
                setError('oldPassword',{
                    type: 'server',
                    message: "mật khẩu cũ khong chinh xac"
                })
            }else if (respone.status === 400 && respone.data) {
                setError('oldPassword',{
                    type: 'server',
                    message: "Bạn mật khẩu không chính xác "
                })
            }
            else if (respone.status === 500) {
                // xóa token nếu xảy ra lỗi và trở về login
                localStorage.removeItem('token'); // Xóa token
                window.location.href = '/login';
            }else {
                toast.success("mật khẩu đã được thay đổi")
                navigate('/userProfile')
            }
            
            
        }


        // điều hướng nguwoif dùng trở lại trong userProfile
        const btnGetout = () => {
            navigate(
                '/userProfile'
            )
        }
        return (
            <div className={styles.changPasswordContainer}>
                <div className={styles.changeBox} >
                    <form className={styles.borderForm} onSubmit={handleSubmit(onSubmit)}>
                        <h2>Thay đổi mật khẩu </h2>

                        <p>Lưu ý nếu không nhớ mật khẩu hãy đăng nhập bằng mã code gửi qua gmail</p>
                                <div className={`${styles.formGroup} ${styles.formInput} `}
                                    >
                                    <label htmlFor="username">mật khẩu cũ:</label>
                                        <input
                                        type="text"
                                        className={`${styles.formControl} ${errors.fullName ? styles.error : ''}`}
                                        placeholder="mật khẩu cũ"
                                        aria-label='mật khẩu cũ'  
                                        {...register('oldPassword')} 
                                        />
                                        {errors.oldPassword && <p className={styles.displayErrors} style={{ color: 'red' }}>{errors.oldPassword.message}</p>}
                                </div>

                                
                            


                                <div className={`${styles.formGroup} ${styles.formInput} `}
                                    >
                                    <label htmlFor="username">Mật khẩu mới:</label>
                                        <input
                                        type="text"
                                        className={`${styles.formControl} `}
                                        placeholder="mật khẩu mới ."
                                        aria-label='new password'   
                                        {...register('newPassword')}
                                        />
                                        {errors.newPassword && <p className={styles.displayErrors} style={{ color: 'red' }}>{errors.newPassword.message}</p>}
                                </div>
                                    

                                <div className={`${styles.formGroup}  ${styles.formInput}`}
                                    >
                                    <label htmlFor="username">xác nhận mật khẩu mới:</label>
                                        <input
                                        type="text"
                                        className={`${styles.formControl} `}
                                        placeholder="xác nhận"
                                        aria-label='confirm new password'
                                        {...register('confirmPassword')}
                                        />
                                        {errors.confirmPassword && <p className={styles.displayErrors} style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                                </div>



                                <div className={styles.forgotPassword}><Link>bằng cách khác</Link></div>

                                <div >
                                <Link to='/userProfile' className={styles.btnGetout }><FontAwesomeIcon icon={faRotateLeft} /> Trở lại</Link>
                                <button type="submit" className={styles.btnSubmit}>xác nhận hoàn tất</button>
                                </div>
                    </form>
                </div>
            </div>
        )
    }

    export default ChangePassword;