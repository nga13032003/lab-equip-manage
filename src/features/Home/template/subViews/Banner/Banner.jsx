/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { banner1Img, banner2Img, banner3Img, card1, card2, card3 } from '../../../../../assets';
import './Banner.scss';
import { FaFileAlt, FaBell, FaSyncAlt } from 'react-icons/fa';

export default function Banner() {
  const bannersList = [
    { id: 1, image: banner1Img },
    { id: 2, image: banner2Img },
    { id: 3, image: banner3Img },
  ];

  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const bannerSliderInterval = setInterval(() => {
      setActiveBanner((prevBanner) => (prevBanner + 1) % bannersList.length);
    }, 5000);

    return () => clearInterval(bannerSliderInterval);
  }, [bannersList.length]);

  return (
    <div className="home-banner">
      {/* Banner Section */}
      <div className="banner-indicators d-flex align-items-center gap-3">
        {bannersList.map((banner, idx) => (
          <button
            className={`${idx === activeBanner ? 'active' : ''}`}
            onClick={() => setActiveBanner(idx)}
            key={banner.id}
          />
        ))}
      </div>
      <div className="banner-inner container-fluid p-0">
        <div
          className="row m-0 p-0 flex-nowrap h-100 banner-slider"
          style={{ transform: `translateX(-${activeBanner * 100}%)` }}
        >
          {bannersList.map((banner, idx) => (
            <div
              key={idx}
              className="banner-inner__item col-12 p-0 h-100"
              style={{ flex: '0 0 100%' }}
            >
              <a href="#">
                <img src={banner.image} className="d-block w-100 h-100" alt="banners" />
              </a>
            </div>
          ))}
        </div>
        <div className="introduce">
        <h1>TIỆN ÍCH</h1>
        <hr />
        <div className="cards-section container py-5">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* Card 1 */}
            <div className="col">
              <div className="card1">
                <div className="card1-body text-center">
                  <FaFileAlt size={50} color="#007bff" />
                  <h5 className="card-title mt-3">BIỂU MẪU</h5>
                  <p className="card-text">
                    Quản lý và tạo các biểu mẫu cần thiết cho công việc của bạn một cách dễ dàng và nhanh chóng.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col">
              <div className="card1">
                <div className="card1-body text-center">
                  <FaBell size={50} color="#007bff" />
                  <h5 className="card-title mt-3">THÔNG BÁO</h5>
                  <p className="card-text">
                    Nhận thông báo và cập nhật mới nhất về các hoạt động và sự kiện quan trọng.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col">
              <div className="card1">
                <div className="card1-body text-center">
                  <FaSyncAlt size={50} color="#007bff" />
                  <h5 className="card-title mt-3">CẬP NHẬT</h5>
                  <p className="card-text">
                    Đảm bảo rằng bạn luôn nhận được các bản cập nhật mới nhất và cải tiến cho các công cụ và dịch vụ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="cards-section container py-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Card 1 */}
          <div className="col">
            <div className="card">
              <img src={card1} className="card-img-top" alt="Card 1" />
              <div className="card-body">
                <h5 className="card-title">Dịch Vụ Tư Vấn</h5>
                <p className="card-text">
                  Cung cấp các dịch vụ tư vấn chuyên nghiệp cho doanh nghiệp, giúp bạn đưa ra các quyết định chiến lược đúng đắn và tối ưu.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col">
          <Link to="/bao-dao-tao" className="card-link">
            <div className="card">
              <img src={card2} className="card-img-top" alt="Card 2" />
              <div className="card-body">
                <h5 className="card-title">Đào Tạo Chuyên Sâu</h5>
                <p className="card-text">
                  Chúng tôi cung cấp các khóa đào tạo chuyên sâu về quản lý, kỹ năng mềm và phát triển nghề nghiệp giúp nâng cao năng lực cá nhân và đội ngũ.
                </p>
              </div>
            </div>
          </Link>
        </div>

          {/* Card 3 */}
          <div className="col">
            <div className="card">
              <img src={card3} className="card-img-top" alt="Card 3" />
              <div className="card-body">
                <h5 className="card-title">Hỗ Trợ Kỹ Thuật</h5>
                <p className="card-text">
                  Chúng tôi cung cấp dịch vụ hỗ trợ kỹ thuật 24/7 để đảm bảo hệ thống của bạn luôn vận hành trơn tru, giảm thiểu thời gian gián đoạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    
  );
}
