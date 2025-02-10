import styles from "./../../css/user-profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as userService from "../../service/UserService";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../../firebaseConfig/firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    numberphone: "",
    username: "",
    gender: true,
    address: "",
    imgUrl: "",
  });
  const [img, setImg] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

  const userInf = async () => {
    try {
      console.log("đã đi vào trong này ");

      const data = await userService.GetUser(); // Gọi hàm lấy dữ liệu người dùng
      setUser(data); // Cập nhật state với dữ liệu nhận được
      console.log(user);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error); // Xử lý lỗi nếu có
    }
  };

  useEffect(() => {
    userInf();
  }, []);

  console.log("đây là user: ",user);
  
  // console.log(user.imgUrl);
  const handleImgae = async () => {
    if (img) {
      console.log("Đã đi vào trong tạo ảnh");

      // Tạo tham chiếu storage cho ảnh
      const storageRef = ref(storage, `image-user/${uuidv4()}`);

      try {
        // Upload ảnh lên Firebase Storage
        await uploadBytes(storageRef, img);

        // Lấy URL của ảnh vừa upload và lưu thành chuỗi string
        const url = await getDownloadURL(storageRef);

        console.log(url + "");

        // Đảm bảo URL là chuỗi string và gửi qua API
        if (typeof url === "string") {
          const response = await userService.updateImage(url);

          // Kiểm tra phản hồi từ API
          if (response === 400) {
            toast.error("Lỗi trong quá trình tải ảnh");
            localStorage.removeItem("token"); // Xóa token
            window.location.href = "/login";
          }
        } else {
          console.error("URL không phải là chuỗi hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.error("Đã có lỗi xảy ra trong quá trình tải ảnh");
      }
    } else {
      console.log("Không có ảnh được chọn");
    }
  };

  // đăng xuất
  const handleSignOut = () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('roles');
    navigate('/')
    // ta.success("trở về đăng nhập");
  };

  const handleChangePassword = () => {
    navigate("/changePassword");
  };
  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userBox}>
        <div className={styles.row}>
          <div className={styles.col3}>
            <div className={styles.avatarImage}>
              <div className={styles.avatar}>
                {user != null ? (
                  <div>
                    <img src={user.imgUrl} height="200px" width="200px" />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={styles.btnUploadImgae}>
              {user != null ? (
                <div>
                  <input
                    type="file"
                    id="file-input"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                  <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                    <button onClick={handleImgae}>
                      <FontAwesomeIcon icon={faPlus} />
                      Chọn ảnh
                    </button>
                  </label>
                </div>
              ) : (
                <></>
              )}
            </div>
            <p>Trần dương hữu xuân</p>
          </div>

          <div className={styles.col7}>
            <form>
              <div className={`${styles.formGroup} ${styles.formInput} `}>
                <label htmlFor="username">fullName:</label>
                <input
                  type="text"
                  className={`${styles.formControl} `}
                  placeholder="full name"
                  aria-label="fullName"
                  value={user.fullName}
                  disabled
                />
              </div>

              <div className={styles.col1}></div>

              <div className={`${styles.formGroup}  ${styles.formInput}`}>
                <label htmlFor="username">birthday:</label>
                <input
                  type="date"
                  className={`${styles.formControl} `}
                  placeholder="birthday"
                  aria-label="birthday"
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formInput} `}>
                <label htmlFor="username">email:</label>
                <input
                  type="text"
                  className={`${styles.formControl}`}
                  placeholder="email"
                  aria-label="email"
                  value={user.email}
                  disabled
                />
              </div>

              <div className={styles.col1}></div>
              <div className={`${styles.formGroup} ${styles.formInput} `}>
                <label htmlFor="username">numberphone:</label>
                <input
                  type="text"
                  className={`${styles.formControl} `}
                  placeholder="numberphone"
                  aria-label="numberphone"
                  value={user.numberphone}
                  disabled
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formInput} `}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className={`${styles.formControl} `}
                  placeholder="username"
                  aria-label="username"
                  value={user.username}
                  disabled
                />
              </div>
              <div className={styles.col1}></div>

              <div className={`${styles.selectGender}`}>
                <label>Gender:</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className={styles.formControl}
                      disabled={false} // Có thể chuyển `disabled` thành `false` nếu cần nhập liệu
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className={styles.formControl}
                      disabled={false}
                    />
                    Nữ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      className={styles.formControl}
                      disabled={false}
                    />
                    Khác
                  </label>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.formInput} `}>
                <label htmlFor="username">Thêm địa chỉ:</label>
                <input
                  type="text"
                  className={`${styles.formControl} `}
                  placeholder="Chưa có địa chỉ"
                  aria-label="numberphone"
                  disabled
                />
                <button className={styles.addAddress}>
                  <FontAwesomeIcon icon={faPlus} />
                  <FontAwesomeIcon icon={faLocationDot} />
                </button>
              </div>

              <div className={styles.btnChange}>
                <button type="submit">Thay đổi tài khoản</button>
              </div>
            </form>
          </div>

          <div className={styles.col2}>
            <div className={styles.logout}>
              <div className={styles.card}>Thẻ ngân hàng</div>

              <div className={styles.promotion}>Mã khuyến mãi của bạn</div>

              <div className={styles.purchased}>Đơn hàng đã mua</div>

              <div className={styles.purchased} onClick={handleChangePassword}>
                Thay đổi mật khẩu?
              </div>

              <button type="submit" onClick={handleSignOut}>
                Đăng xuất
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className={styles.iconLog}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
