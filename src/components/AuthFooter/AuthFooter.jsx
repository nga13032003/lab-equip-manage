import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import './AuthFooter.scss';

const AuthFooter = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        {/* Column 1 */}
        <div className="footer-column">
          <h4>QUẢN LÝ PHÒNG DỤNG CỤ, THIẾT BỊ</h4>
          <p>
            Đề tài hướng đến việc xây dựng một ứng dụng web quản lý thiết bị và dụng cụ tại phòng thí nghiệm hóa học Đại học Công thương TP.HCM.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>Thông Tin Liên Hệ</h4>
          <p>
            <FaMapMarkerAlt /> 140 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, Tp. HCM
          </p>
          <p>
            <FaPhoneAlt /> (028) 38161673 - (028) 38163319
          </p>
          <p>
            <FaEnvelope /> contact@example.com
          </p>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Liên Kết Hữu Ích</h4>
          <ul>
            <li><a href="#!">Trang Chủ</a></li>
            <li><a href="#!">Hướng Dẫn Sử Dụng</a></li>
            <li><a href="#!">Liên Hệ</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Đại học Công Thương TP.HCM.
      </div>
    </footer>
  );
};

export default AuthFooter;
