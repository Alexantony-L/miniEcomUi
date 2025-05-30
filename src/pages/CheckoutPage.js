import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = state || {};

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    transactionInput: "1"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    for (const field in form) {
      if (!form[field]) newErrors[field] = "This field is required";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Must be 10 digits";
    }

if (!/^\d{16}$/.test(form.cardNumber)) {
  newErrors.cardNumber = "Card number must be 16 digits";
}

    if (!form.expiry) {
  newErrors.expiry = "Expiry date is required";
} else {
  const match = form.expiry.match(/^(\d{2})\/(\d{2})$/); 

  if (!match) {
    newErrors.expiry = "Invalid format (use MM/YY)";
  } else {
    const inputMonth = parseInt(match[1], 10);
    const inputYear = parseInt(match[2], 10) + 2000; 

    const expiryDate = new Date(inputYear, inputMonth);
    const today = new Date();

    if (expiryDate <= today) {
      newErrors.expiry = "Expiry date must be a future date";
    }
  }
}
    if (!/^\d{3}$/.test(form.cvv)) {
  newErrors.cvv = "CVV must be exactly 3 digits";
}

    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      product: {
        name: product.title,
        variant: "Standard",
        quantity: quantity,
        price: product.price
      },
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip
      },
      transactionInput: form.cardNumber
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/api/orders`, payload);
      navigate(`/thank-you/${res.data.orderId}`);
    } catch (err) {
      alert("Order failed");
    }
  };

  if (!product) return <p className="text-center mt-10">No product selected</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {Object.entries(form).map(([field, value]) => (
        <div key={field} className="mb-3">
          <input
            type={field === "cvv" || field === "zip" || field === "cardNumber" ? "number" : "text"}
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={value}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors[field] && (
            <p className="text-red-500 text-sm">{errors[field]}</p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
      >
        Submit Order
      </button>
    </div>
  );
}

export default CheckoutPage;
