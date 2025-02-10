import style from "./../../css/create-register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCakeCandles,
  faUser,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as userservice from "../../service/UserService";
import VerifyCodeModal from "./verify-code-modal";
import Header from "../home/header/header";
import Footer from "../home/footer/footer";

/**
 * Component ChangePassword: Cho phép người dùng thay đổi mật khẩu
 * @returns JSX Component
 */
const CreateAccount = () => {
  console.log(2);

  // hook đóng mở modal xác thực
  const [openModal, setOpenModal] = useState(false);

  // hook gửi email để gửi mã code
  const [emailCheck, setEmailCheck] = useState("");

  // hook xác thực bên modal
  const [code, setCode] = useState(false);

  // hook chứ thông tin user
  const [users, setUsers] = useState({});
  // cấu hình valiation shema cho form với Yup
  const schema = Yup.object().shape({
    fullName: Yup.string()
      .required("Tên không được để trống")
      .max(50, "Tên không được vượt quá 50 kí tự"),

    email: Yup.string()
      .required("Email không được để trống")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email không hợp lệ"
      ),

    birthday: Yup.string().required("Không được để trống"),

    numberphone: Yup.string()
      .required("Không được để trống")
      .matches(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),

    username: Yup.string().required("Username không được để trống"),

    password: Yup.string()
      .required("Password không được để trống")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/,
        "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt"
      ),

    confirmPassword: Yup.string()
      .required("Xác nhận mật khẩu không được để trống")
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
  });

  // khởi tạo đối tượng useForm với YupResolver
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * xử lý khi người dùng submit form
   * @param {*} data dữ liệu sẽ là người dùng nhập vào các thông tin cần thiết
   */
  const onSubmit = async (data, event) => {
    // gửi yêu cầu tạo tài khoản từ server
    const userResult = await userservice.CreateAccount(data);

    // xử lý các trường hợp lỗi trả về từ server
    // Array.isArray(userResult)
    if (Array.isArray(userResult)) {
      userResult.forEach((error) => {
        if (error.numberphone) {
          setError("numberphone", {
            type: "server",
            message: error.numberphone,
          });
        }

        if (error.email) {
          setError("email", {
            type: "server",
            message: error.email,
          });
        }

        if (error.username) {
          console.log("username");
          setError("username", {
            type: "server",
            message: error.username,
          });
        }
      });
    } else {
      setEmailCheck(data.email);
      // gửi yêu cầu về server và check mã code
      userservice.SendCodeEmail(data.email).then(() => {
        setUsers(data);
      });
      setOpenModal(true);
    }
  };

  return (
    
    <div>
      <Header/>
        <div className={style.registerContainer}>
      <div className={style.registerBox}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.row}>
            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">fullName:</label>
              <input
                type="text"
                className={`${style.formControl} ${
                  errors.fullName ? style.error : ""
                }`}
                placeholder="full name"
                aria-label="fullName"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className={style.col1}></div>

            <div
              className={`${style.formGroup} ${style.col5} ${style.formInput}`}
            >
              <label htmlFor="username">birthday:</label>
              <input
                type="date"
                className={`${style.formControl} ${
                  errors.birthday ? style.error : ""
                }`}
                placeholder="birthday"
                aria-label="birthday"
                {...register("birthday")}
              />
              {errors.birthday && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.birthday.message}
                </p>
              )}
            </div>
          </div>

          <div className={style.row}>
            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">email:</label>
              <input
                type="text"
                className={`${style.formControl} ${
                  errors.email ? style.error : ""
                }`}
                placeholder="email"
                aria-label="email"
                {...register("email")}
              />
              {errors.email && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={style.col1}></div>
            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">numberphone:</label>
              <input
                type="text"
                className={`${style.formControl} ${
                  errors.numberphone ? style.error : ""
                }`}
                placeholder="numberphone"
                aria-label="numberphone"
                {...register("numberphone")}
              />
              {errors.numberphone && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.numberphone.message}
                </p>
              )}
            </div>
          </div>

          <div className={style.row}>
            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className={`${style.formControl} ${
                  errors.username ? style.error : ""
                }`}
                placeholder="username"
                aria-label="username"
                {...register("username")}
              />
              {errors.username && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className={style.col1}></div>

            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">Password:</label>
              <input
                type="password"
                className={`${style.formControl} ${
                  errors.password ? style.error : ""
                }`}
                placeholder="password"
                aria-label="password"
                {...register("password")}
              />
              {errors.password && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className={style.row}>
            <div
              className={`${style.formGroup} ${style.formInput} ${style.col5}`}
            >
              <label htmlFor="username">confirmPassword:</label>
              <input
                type="password"
                className={`${style.formControl} ${
                  errors.confirmPassword ? style.error : ""
                }`}
                placeholder="confirmPassword"
                aria-label="confirmPassword"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className={style.displayErrors} style={{ color: "red" }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <button type="submit" className={style.btnSubmit}>
            REGISTER
          </button>
        </form>
      </div>
      <VerifyCodeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        emailCheck={emailCheck}
        users={users}
      />

    </div>
      <Footer/>
    </div>  
    );
};

export default CreateAccount;
