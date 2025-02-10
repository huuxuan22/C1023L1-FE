import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import * as userService from "../../service/UserService";
import { date } from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 *
 * phần này sẽ kiểm tra mã code trước khi xuống lưu nguwoif dùng
 *
 * @param {*} param0 openModal => đóng mở modal
 *                   setOpenModal => thiết lập đóng mở
 *                    emailCheck => đây chính là email check cho bạn kèm theo code để biết của thằng nào
 *                    setCode  => thừa thải
 *                    users => đây là thông tin user
 *
 * @returns JSX Component
 */
function VerifyCodeModal({ openModal, setOpenModal, emailCheck, users }) {
  const [inputCode, setInputCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log(emailCheck);

  // Đóng modal
  const handleClose = () => {
    setOpenModal(false);
    setInputCode(["", "", "", "", "", ""]);
    setError("");
  };

  // xét thời gian xóa lỗi
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // validate cho thằng nhập vào trong form
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
    setError("");
  };

  // submit gửi
  const handleSubmit = async () => {
    const newInputCodeString = inputCode.join("");
    try {
      const response = await userService.GetCode(
        newInputCodeString,
        emailCheck
      );

      // Kiểm tra phản hồi từ backend
      if (response) {
        console.log("đã đi vào đây");
        console.log(users);

        setOpenModal(false);
        await userService.SaveUser(users).then(() => {
          navigate("/home");
          toast.success("Xác thực thành công");
        });
      } else {
        setError("Mã code bạn nhập không chính xác"); // Sử dụng thông điệp lỗi từ backend
      }
    } catch (error) {
      console.log(error); // Log lỗi để dễ dàng debug
      setError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  return (
    <div>
      <Modal show={openModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nhập mã xác thực</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="d-flex justify-content-center">
              {inputCode.map((digit, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  id={`input-${index}`}
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  maxLength={1}
                  style={{ width: "50px", margin: "0 5px" }}
                />
              ))}
            </Form.Group>
            {error && <p className="error-message">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VerifyCodeModal;
