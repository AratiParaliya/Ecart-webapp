import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi } from "../../utils/api";
import { Button, Divider, CircularProgress } from "@mui/material";
import {
  LocalShippingOutlined, CheckCircleRounded, Inventory2Outlined,
  HomeOutlined, CancelOutlined, CloudDownloadOutlined, ReplayRounded,
  LocationOnOutlined, AccessTimeOutlined
} from "@mui/icons-material";
import RelatedProducts from "../ProductDetails/RelatedProducts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNote, setCancelNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getOrder();
    const interval = setInterval(getOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const getOrder = async () => {
    const res = await fetchDataFromApi(`/api/orders/${id}`);
    if (res?.success) setOrder(res.order);
  };

  const normalizedStatus = order?.status?.toLowerCase();

  const steps = [
    { label: "Ordered", icon: <Inventory2Outlined fontSize="small" />, key: "ordered" },
    { label: "Shipped", icon: <LocalShippingOutlined fontSize="small" />, key: "shipped" },
    { label: "Out for Delivery", icon: <LocalShippingOutlined fontSize="small" />, key: "out for delivery" },
    { label: "Delivered", icon: <HomeOutlined fontSize="small" />, key: "delivered" },
  ];

  const getStepIndex = () => {
    const map = { ordered: 0, pending: 0, shipped: 1, "out for delivery": 2, delivered: 3 };
    return map[normalizedStatus] ?? 0;
  };

  const canCancelOrder = () =>
    ["pending", "ordered", "processing"].includes(normalizedStatus);

  const downloadInvoice = async () => {
    const element = document.getElementById("invoice");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`invoice_${order._id}.pdf`);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) return;
    const res = await editData(`/api/orders/cancel/${order._id}`, {
      reason: cancelReason,
      note: cancelNote,
    });
    if (res?.success) {
      setOpenCancel(false);
      getOrder();
    }
  };

  if (!order) {
    return (
      <div className="loader-container">
        <CircularProgress />
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-container fade-in">

      {/* HEADER */}
      <div className="order-header">
        <div>
          <h2>Order Details</h2>
          <p>#{order._id.slice(-8)}</p>
          <small>
            {new Date(order.dateCreated).toLocaleString("en-IN")}
          </small>
        </div>

        <div className="header-actions">
          <Button onClick={downloadInvoice} startIcon={<CloudDownloadOutlined />}>
            Invoice
          </Button>

          {normalizedStatus === "cancelled" && (
            <Button
              variant="contained"
              startIcon={<ReplayRounded />}
              onClick={() =>
                navigate(`/product/${order.orderItems[0].productId}`)
              }
            >
              Buy Again
            </Button>
          )}

          {canCancelOrder() && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCancel(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="row">
        {/* LEFT */}
        <div className="col-lg-8">

          {/* ITEMS */}
          <div className="glass-card">
            <h4>Items ({order.orderItems.length})</h4>

            {order.orderItems.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.image} alt="" />
                <div>
                  <h5>{item.name}</h5>
                  <p>Qty: {item.quantity}</p>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* STATUS */}
          <div className="glass-card status-box">
            <h4>{order.status}</h4>
            <p>Expected Delivery: 3-5 Days</p>
          </div>

          {/* STEPS */}
          <div className="glass-card">
            <h4>Order Progress</h4>

            <div className="stepper">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step ${i <= getStepIndex() ? "active" : ""}`}
                >
                  {step.icon}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE */}
          <div className="glass-card">
            <h4>Shipment History</h4>

            {steps.slice(0, getStepIndex() + 1).map((s, i) => (
              <div key={i} className="timeline-item">
                <div className="dot" />
                <div>
                  <p>{s.label}</p>
                  <small>{new Date(order.dateCreated).toDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-4 sticky">

          {/* ADDRESS */}
          <div className="glass-card">
            <h4><LocationOnOutlined /> Address</h4>
            <p>
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address1}</p>
            <p>{order.shippingAddress.city}</p>
          </div>

          {/* PAYMENT */}
          <div className="glass-card">
            <h4>Payment</h4>

            <div className="row-between">
              <span>Subtotal</span>
              <span>₹{order.itemsPrice}</span>
            </div>

            <div className="row-between">
              <span>Shipping</span>
              <span className="green">FREE</span>
            </div>

            <Divider />

            <div className="row-between total">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="related-section">
        <h3>Recently Viewed</h3>
        <RelatedProducts type="recent" />
      </div>

      {/* CANCEL MODAL */}
      {openCancel && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Cancel Order</h3>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option>Ordered by mistake</option>
              <option>Found cheaper</option>
            </select>

            <textarea
              placeholder="Note"
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setOpenCancel(false)}>Close</button>
              <button onClick={handleCancelSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN INVOICE */}
      <div id="invoice" className="hidden-invoice">
        <h2>Invoice #{order._id.slice(-6)}</h2>
        <p>Total: ₹{order.totalPrice}</p>
      </div>

    </div>
  );
};

export default OrderDetails;