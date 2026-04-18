import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { FaTruck, FaHeadset, FaCreditCard, FaUndo } from "react-icons/fa";

const iconMap = {
  FaTruck: <FaTruck />,
  FaHeadset: <FaHeadset />,
  FaCreditCard: <FaCreditCard />,
  FaUndo: <FaUndo />
};

const Services = () => {

  const [data, setData] = useState([]);

useEffect(() => {
  fetchDataFromApi("/api/services").then(res => {
    const activeServices = (res.data || [])
      .filter(item => item.status === true)
      .slice(0, 4); // ✅ only latest 4

    setData(activeServices);
  });
}, []);

  return (
    <section className="services">
      <div className="container">
        <div className="services-container">

          {data.map((item, i) => (
            <div key={i} className="service-box" style={{ backgroundColor: item.bg }}>
             <div className="icon">
  {iconMap[item.icon] || <FaTruck />}
</div>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Services;