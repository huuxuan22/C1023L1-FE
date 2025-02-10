// Home.js
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import {  FaUser, FaRegBell, FaQuestionCircle, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/header';
import OrderModal from '../../order-modal/order-modal';


function Home() {
    const [isOpen, setIsOpen] = useState(false);

  // Hàm đóng modal
  const handleClose = () => setIsOpen(false);

  // Dùng useEffect để mở modal ngay khi trang được tải
  useEffect(() => {
    setIsOpen(true);  // Mở modal khi component được render
  }, []);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles');
    console.log(token);
    console.log(roles);
    
    
    const handleLogout = () => {
        // Xóa token khỏi localStorage để đăng xuất
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        
        // Chuyển hướng về trang đăng nhập
        navigate("/login");
      };
    return (
        <div>
            <OrderModal isOpen={isOpen} onClose={handleClose} />
            <Header/>
            <div className={styles.homeContainer}>
            {/* Header */}
           

            {/* Nội dung giới thiệu */}
            <section className={styles.intro}>
                <h2>Our Coffee Products</h2>
                <p>Discover our selection of premium coffee products.</p>

                <div className={styles.slider}>
                    <div className={styles.slide}>
                        <img src="https://napoli.vn/Document/Images/BaiViet/22(1).jpg" alt="Giảm giá 1" />
                        <h3>Espresso Roast - Giảm 20%</h3>
                        <p>Giảm giá đặc biệt cho Espresso Roast! Tận hưởng hương vị đậm đà với giá ưu đãi.</p>
                    </div>
                    <div className={styles.slide}>
                        <img src="https://napoli.vn/Document/Images/BaiViet/22(1).jpg" alt="Giảm giá 2" />
                        <h3>French Vanilla - Giảm 15%</h3>
                        <p>Khám phá hương vị vanilla mềm mịn với mức giảm giá hấp dẫn.</p>
                    </div>
                    <div className={styles.slide}>
                        <img src="https://napoli.vn/Document/Images/BaiViet/22(1).jpg" alt="Giảm giá 3" />
                        <h3>Colombian Dark - Giảm 10%</h3>
                        <p>Giảm giá đặc biệt cho sản phẩm cà phê Colombian Dark với hương vị độc đáo.</p>
                    </div>
                </div>

                

                
                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <img src="https://lepathcoffee.com/wp-content/uploads/2021/12/nen-uong-ca-phe-den-hay-ca-phe-sua.jpg" alt="Coffee Product 1" />
                        <h3>Espresso Roast</h3>
                        <p>Rich, full-bodied espresso roast with a dark, bold flavor.</p>
                        <p className={styles.price}>$15.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://vanmart.vn/thumbs/600x600x1/upload/product/cafe-den-da-8801.png" alt="Coffee Product 1" />
                        <h3>Espresso Roast</h3>
                        <p>Rich, full-bodied espresso roast with a dark, bold flavor.</p>
                        <p className={styles.price}>$15.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6-XbiHprDY-o_rPDojGDBXo3P4ea_dcz6Yg&s" alt="Coffee Product 2" />
                        <h3>French Vanilla</h3>
                        <p>Smooth and creamy blend with a hint of vanilla flavor.</p>
                        <p className={styles.price}>$14.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxs_E7v0sd3iR4HacR5A3U-Gj3FogFT4R9nA&s" alt="Coffee Product 3" />
                        <h3>Colombian Dark</h3>
                        <p>A robust dark roast with notes of cocoa and caramel.</p>
                        <p className={styles.price}>$16.99</p>
                    </div>
                </div>


                <div className={styles.aboutOwner}>
                    <img src="https://cafefcdn.com/203337114487263232/2021/11/9/photo-1-1636442305428116486711.jpg" alt="Owner Image" className={styles.ownerImage} />
                    <div className={styles.ownerInfo}>
                        <h3>About the Owner - Xuân</h3>
                        <p>Our coffee shop was founded by Xuân, a passionate coffee lover with a dream to bring quality coffee to the community. Xuân believes that each cup of coffee should bring not just a taste of excellence, but also a moment of peace and connection.</p>
                        <p>Our coffee is ethically sourced, ensuring that every sip contributes positively to the environment and supports local farmers.</p>
                    </div>
                </div>

                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Yho_cynQjP33d31Dm_Q96b-hq7aL_Xu6KQ&s" alt="Coffee Product 1" />
                        <h3>Espresso Roast</h3>
                        <p>Rich, full-bodied espresso roast with a dark, bold flavor.</p>
                        <p className={styles.price}>$15.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2y-xsugFXjRom8_SmdCsZ5NmfrAlN_sfpNA&s" alt="Coffee Product 1" />
                        <h3>Espresso Roast</h3>
                        <p>Rich, full-bodied espresso roast with a dark, bold flavor.</p>
                        <p className={styles.price}>$15.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://trungnguyenecoffee.com/wp-content/uploads/2021/07/H%C3%ACnh-App_3006021-C%C3%A0-Ph%C3%AA-S%E1%BB%AFa.jpg" alt="Coffee Product 2" />
                        <h3>French Vanilla</h3>
                        <p>Smooth and creamy blend with a hint of vanilla flavor.</p>
                        <p className={styles.price}>$14.99</p>
                    </div>

                    <div className={styles.card}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2y-xsugFXjRom8_SmdCsZ5NmfrAlN_sfpNA&s" alt="Coffee Product 3" />
                        <h3>Colombian Dark</h3>
                        <p>A robust dark roast with notes of cocoa and caramel.</p>
                        <p className={styles.price}>$16.99</p>
                    </div>
                </div>
            </section>  

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>MyWebsite</div>
                    <p>&copy; 2024 My Website. All rights reserved.</p>
                    <div className={styles.socialIcons}>
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                    </div>
                </div>
            </footer>
        </div>
        </div>
    );
}

export default Home;
