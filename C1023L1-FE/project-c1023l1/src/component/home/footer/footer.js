import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"
import styles from "./footer.module.css"

const Footer = () => {
    return (
        <div>
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
    )
}

export default Footer