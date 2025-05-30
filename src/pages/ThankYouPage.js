import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ThankYouPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`${REACT_APP_SERVER}/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => alert("Order not found"));
  }, [orderId]);

  if (!order) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
      <p className="mb-4">Your order has been placed successfully.</p>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Status:</strong> {order.transactionStatus}</p>
        <hr className="my-2" />
        <h3 className="font-semibold">Product</h3>
        <p>{order.product.name} - {order.product.variant}</p>
        <p>Qty: {order.product.quantity}</p>
        <p>Total: ${order.product.quantity * order.product.price}</p>
        <hr className="my-2" />
        <h3 className="font-semibold">Customer</h3>
        <p>{order.customer.fullName}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
        <p>{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.zip}</p>
      </div>
    </div>
  );
}

export default ThankYouPage;
