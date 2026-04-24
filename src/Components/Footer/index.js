import { Link } from "react-router-dom";
import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery, TbDiscount } from "react-icons/tb";
import { CiBadgeDollar } from "react-icons/ci";
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingBag } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        {/* TOP INFO */}
        <div className="footer-topInfo">
          <div className="footer-topInfo-col">
            <span className="icon"><LuShirt /></span>
            <span>Fresh products daily</span>
          </div>
          <div className="footer-topInfo-col">
            <span className="icon"><TbTruckDelivery /></span>
            <span>Free delivery over $70</span>
          </div>
          <div className="footer-topInfo-col">
            <span className="icon"><TbDiscount /></span>
            <span>Daily mega discounts</span>
          </div>
          <div className="footer-topInfo-col">
            <span className="icon"><CiBadgeDollar /></span>
            <span>Best market prices</span>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          {/* BRAND */}
          <div className="footer-brand">
            <div className="footer-logo">
              <FaShoppingBag size={34} />
              <h1>Multimart</h1>
            </div>
            <p className="footer-brand-desc">
              Your one-stop destination for quality products at unbeatable prices.
              We bring the best brands and freshest items straight to your doorstep —
              fast, reliable, and always affordable.
            </p>
          </div>

          {/* ABOUT */}
          <div className="footer-col">
            <h5>About Us</h5>
            <ul>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Our Stores</Link></li>
              <li><Link to="#">Our Cares</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="footer-col">
            <h5>Customer Care</h5>
            <ul>
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">How to Buy</Link></li>
              <li><Link to="#">Track Your Order</Link></li>
              <li><Link to="#">Bulk Purchasing</Link></li>
              <li><Link to="#">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-col">
            <h5>Contact Us</h5>
            <ul>
              <li><Link to="#">70 Washington Square South, New York, NY 10012</Link></li>
              <li><Link to="#">uilib.help@gmail.com</Link></li>
              <li><Link to="#">+1 1123 456 780</Link></li>
            </ul>
          </div>

          {/* INFORMATION */}
          <div className="footer-col">
            <h5>Information</h5>
            <ul>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Delivery Info</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
              <li><Link to="#">Support Center</Link></li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="footer-copyright">
          <p>© 2024 Multimart. All rights reserved.</p>
          <div className="footer-socials">
            <Link to="#"><FaFacebookF /></Link>
            <Link to="#"><FaTwitter /></Link>
            <Link to="#"><FaInstagram /></Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;