import styles from "./create-new-account.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as userService from "../../service/UserService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
const CreateNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const inf = location.state;
  const shema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Password không được để trống")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/,
        "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt"
      ),

    confirmPassword: Yup.string()
      .required("Xác nhận mật khẩu không được để trống")
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
  });

  // khởi tạo useForm với Yup resolver
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shema),
  });

  const onSubmit = (data) => {
     userService.CreateNewPassword(data.newPassword,inf.username,inf.email).then(() => {
        navigate('/login');
        toast.success('Hãy đăng nhập bằng mật khẩu bạn vừa thay đỏi')
     });

  };

  return (
    <div className={styles.changPasswordContainer}>
      <div className={styles.changeBox}>
        <form className={styles.borderForm} onSubmit={handleSubmit(onSubmit)}>
          <h2>Thay đổi mật khẩu tạo mật khẩu mới</h2>
          <div className={`${styles.formGroup} ${styles.formInput} `}>
            <label htmlFor="username">Mật khẩu mới:</label>
            <input
              type="text"
              className={`${styles.formControl} `}
              placeholder="mật khẩu mới ."
              aria-label="new password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className={styles.displayErrors} style={{ color: "red" }}>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className={`${styles.formGroup}  ${styles.formInput}`}>
            <label htmlFor="username">xác nhận mật khẩu mới:</label>
            <input
              type="text"
              className={`${styles.formControl} `}
              placeholder="xác nhận"
              aria-label="confirm new password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className={styles.displayErrors} style={{ color: "red" }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className={styles.forgotPassword}>
            <Link>bằng cách khác</Link>
          </div>

          <div>
            <Link to="/userProfile" className={styles.btnGetout}>
              <FontAwesomeIcon icon={faRotateLeft} /> Trở lại
            </Link>
            <button type="submit" className={styles.btnSubmit}>
              xác nhận hoàn tất
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
