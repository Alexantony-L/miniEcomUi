import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    axios.get("https://dummyjson.com/products")
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  }, []);
const handleVariantChange = (productId, variant) => {
  setSelectedOptions((prev) => ({
    ...prev,
    [productId]: {
      ...prev[productId],
      variant
    }
  }));
};

const handleQuantityChange = (productId, quantity) => {
  setSelectedOptions((prev) => ({
    ...prev,
    [productId]: {
      ...prev[productId],
      quantity: Number(quantity)
    }
  }));
};

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    navigate("/checkout", { state: { product, quantity } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{products.map((product) => {
  const selected = selectedOptions[product.id] || {};
  return (
    <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover mb-4 rounded" />
      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-600">{product.description.slice(0, 100)}...</p>
      <p className="text-lg font-bold mt-2">${product.price}</p>

      <label className="block mt-3 text-sm font-medium">Variant:</label>
<select
  className="border rounded px-2 py-1 w-full"
  onChange={(e) => handleVariantChange(product.id, e.target.value)}
>
  <option value="">Select Variant</option>
  {product.tags.map((tag, i) => (
    <option key={i} value={tag}>{tag}</option>
  ))}
</select>


 
      <label className="block mt-3 text-sm font-medium">Quantity:</label>
      <input
        type="number"
        min="1"
        value={selected.quantity || 1}
        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={() => {
          if (!selected.variant) {
            alert("Please select a variant.");
            return;
          }
          navigate("/checkout", {
            state: {
              product: { ...product, variant: selected.variant },
              quantity: selected.quantity || 1
            }
          });
        }}
      >
        Buy Now
      </button>
    </div>
  );
})}

      </div>
    </div>
  );
}

export default LandingPage;
