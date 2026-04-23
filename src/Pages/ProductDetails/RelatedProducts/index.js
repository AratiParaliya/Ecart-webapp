import Button from "react-bootstrap/Button";
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductItem from "../../../Components/ProductItem";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import { fetchDataFromApi, postData } from "../../../utils/api";


const RelatedProducts = ({ title, productId, type }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (type === "related" && productId) {
      getRelatedProducts();
    } else if (type === "recent") {
      getRecentProducts();
    }
  }, [productId, type]);

  const getRelatedProducts = async () => {
    try {
      const data = await fetchDataFromApi(`/api/products/related/${productId}`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentProducts = async () => {
    try {
      const ids = JSON.parse(localStorage.getItem("recentProducts")) || [];
      if (ids.length === 0) return;
      const data = await postData("/api/products/by-ids", { ids });
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mt-3">
        <div className="info w-75">
          <h3 className="mb-3 hd">{title}</h3>
        </div>
      </div>

      <div className="product_row w-100 mt-0">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          slidesPerGroup={1}
          spaceBetween={12}
          breakpoints={{
            // < 480px — 1 card
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            // 480px — 2 cards
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 10,
            },
            // 640px — 3 cards
            640: {
              slidesPerView: 3,
              slidesPerGroup: 2,
              spaceBetween: 12,
            },
            // 900px — 4 cards
            900: {
              slidesPerView: 4,
              slidesPerGroup: 3,
              spaceBetween: 12,
            },
            // 1200px — 5 cards
            1200: {
              slidesPerView: 5,
              slidesPerGroup: 3,
              spaceBetween: 12,
            },
          }}
        >
          {products.length > 0 ? (
            products.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductItem item={item} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="related-empty">
                <div className="related-empty__icon">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/4076/4076549.png"
                    alt="no products"
                  />
                </div>
                <h6>No Related Products</h6>
                <p>We couldn't find similar items right now.</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </>
  );
};

export default RelatedProducts;