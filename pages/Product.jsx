import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";

function Product() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // ✅ use global cart
  const { addNotification } = useNotification(); // ✅ show notifications

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const currentUser = localStorage.getItem("userId");

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Categories
  const categories = [
    "all",
    "iphone",
    "oppo",
    "realme",
    "vivo",
    "pixel",
    "redmi",
    "samsung",
  ];

  const filtered = products.filter((p) => {
    const searched = p.name.toLowerCase().includes(search.toLowerCase());
    return (category === "all" || p.category === category) && searched;
  });

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    addToCart(product); // ✅ add via context
    addNotification(`${product.name} added to cart`);
  };

  const goToCart = () => navigate("/cart");

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">All Products</h1>

      {/* Search */}
      <form className="d-flex justify-content-center mb-4">
        <input
          className="rounded-pill px-3"
          type="search"
          placeholder="Search 5G Store"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Categories */}
      <div className="text-center mb-4 d-flex gap-2 justify-content-center flex-wrap">
        {categories.map((c) => (
          <Button
            key={c}
            variant={category === c ? "secondary" : "outline-secondary"}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* Product cards */}
      <Row className="g-4">
        {filtered.map((p) => {
          const inCart = cart.some((item) => item.productId === p.id);
          return (
            <Col md={4} sm={6} xs={12} key={p.id}>
              <Card className="shadow-sm rounded-3 p-4 h-100">
                <Card.Img
                  variant="top"
                  src={p.image}
                  style={{ height: "250px", objectFit: "contain" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{p.name}</Card.Title>
                  <Card.Text className="fw-bold fs-5 text-success">
                    ₹{p.price}
                  </Card.Text>
                  <Card.Text className="text-muted">{p.specs}</Card.Text>

                  <div className="mt-auto d-grid">
                    {inCart ? (
                      <Button className="btn-cart-green" onClick={goToCart}>
                        Go to Cart
                      </Button>
                    ) : (
                      <Button
                        className="btn-secondary"
                        onClick={() => handleAddToCart(p)}
                      >
                        ADD TO CART
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Product;