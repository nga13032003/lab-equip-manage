/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { banner1Img, banner2Img, banner3Img } from '../../../../../assets';
import './Banner.scss';

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
    <div className='home-banner'>
      <div className='banner-indicators d-flex align-items-center gap-3'>
        {bannersList.map((banner, idx) => (
          <button
            className={`${idx === activeBanner ? 'active' : ''}`}
            onClick={() => setActiveBanner(idx)}
            key={banner.id}
          />
        ))}
      </div>
      <div className='banner-inner container-fluid p-0'>
        <div
          className='row m-0 p-0 flex-nowrap h-100 banner-slider'
          style={{ transform: `translateX(-${activeBanner * 100}%)` }}
        >
          {bannersList.map((banner, idx) => (
            <div
              key={idx}
              className='banner-inner__item col-12 p-0 h-100'
              style={{ flex: '0 0 100%' }}
            >
              <a href="#">
                <img src={banner.image} className='d-block w-100 h-100' alt='banners' />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
