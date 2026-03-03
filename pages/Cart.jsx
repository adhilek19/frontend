import React from "react";
import { Card, Button, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

function Cart() {
  const {
    cart,
    loading,
    increaseQty,
    decreaseQty,
    removeItem,
    total,
  } = useCart();

  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userId");

  // ✅ Increase quantity
 // ✅ Live handlers
const handleIncrease = (item) => {
  increaseQty(item); // CartContext updates state instantly
  addNotification(`${item.name} quantity increased`);
};

const handleDecrease = (item) => {
  decreaseQty(item); // CartContext updates state instantly
  addNotification(`${item.name} quantity decreased`);
};

const handleRemove = (item) => {
  removeItem(item.id); // CartContext updates state instantly
  addNotification(`${item.name} removed from cart`);
};
  // ✅ Checkout (ONLY navigate — do NOT clear cart)
  const checkout = () => {
    if (cart.length === 0) return;

    navigate("/order", {
      state: { products: cart, total },
    });
  };

  if (!currentUser)
    return (
      <h5 className="text-center mt-5">
        Please login to view cart
      </h5>
    );

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4"> My Cart</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <h4>Your cart is empty</h4>
          <Button className="mt-3" onClick={() => navigate("/product")}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            {cart.map((item) => (
              <Card key={item.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    
                    <Col md={2}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid"
                        style={{ height: 80, objectFit: "contain" }}
                      />
                    </Col>

                    <Col md={3}>
                      <h6>{item.name}</h6>
                      <small>₹{item.price}</small>
                    </Col>

                    <Col md={3} className="d-flex gap-2 align-items-center">
                      <Button
                        size="sm"
                        onClick={() => handleDecrease(item)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        size="sm"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </Button>
                    </Col>

                    <Col md={2}>
                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>
                    </Col>

                    <Col md={2} className="text-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(item)}
                      >
                        Remove
                      </Button>
                    </Col>

                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          <Col lg={4}>
            <Card className="shadow sticky-top" style={{ top: "90px" }}>
              <Card.Body>
                <h5>Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <strong className="text-success">
                    ₹{total}
                  </strong>
                </div>

                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={checkout}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Cart;