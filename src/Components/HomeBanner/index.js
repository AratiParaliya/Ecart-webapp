import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaRegImages } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/banner?type=home&status=true").then((res) => {
      const bannerData = res?.data || res?.banners || [];
      setBanners(bannerData.filter((item) => item.status === true));
    });
  }, []);

  return (
    <>
      <div className="home-banner-section">
        {banners.length > 0 ? (
          <Swiper
            slidesPerView={1}
            navigation={true}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            modules={[Navigation, Autoplay]}
            className="home-banner-swiper"
          >
            {banners.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="hb-slide"
                  style={{
                    background: item.bgColor
                      ? item.bgColor
                      : 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fc 60%, #fce7f3 100%)',
                  }}
                >
                  {/* Background decorative circles */}
                  <div className="hb-deco hb-deco-1" />
                  <div className="hb-deco hb-deco-2" />

                  <div className="hb-inner">
                    {/* Text side */}
                    <div className="hb-content">
                      {item.tag && <span className="hb-tag">{item.tag}</span>}
                      <h1 className="hb-title">{item.title}</h1>
                      {item.desc && <p className="hb-desc">{item.desc}</p>}
                      <button className="hb-btn">
                        Visit Collections
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 6 }}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>

                    {/* Image side */}
                    <div className="hb-img-wrap">
                      <div className="hb-img-bg" />
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title || 'Banner'}
                        className="hb-img"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hb-empty">
            <FaRegImages className="hb-empty-icon" />
            <h2>No Banners Available</h2>
            <p>Looks like there are no active banners right now.</p>
            <button className="hb-btn">Explore Products</button>
          </div>
        )}
      </div>

    
    </>
  );
};

export default HomeBanner;