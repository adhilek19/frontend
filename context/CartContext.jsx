import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserId = () => localStorage.getItem("userId");

  // ✅ Fetch cart
  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/cart?userId=${userId}`
      );
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 ADD TO CART (Instant)
  const addToCart = async (product) => {
    const userId = getUserId();
    if (!userId) return;

    const existing = cart.find(
      (item) => item.productId === product.id
    );

    if (existing) {
      increaseQty(existing);
      return;
    }

    const newItem = {
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    // 🔥 Update UI instantly
    const tempId = Date.now();
    setCart((prev) => [...prev, { ...newItem, id: tempId }]);

    try {
      const res = await axios.post(
        "http://localhost:5000/cart",
        newItem
      );

      // 🔥 Replace temp item with real DB item
      setCart((prev) =>
        prev.map((item) =>
          item.id === tempId ? res.data : item
        )
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  // 🔥 Increase quantity (Instant)
  const increaseQty = async (item) => {
    const updatedQty = item.quantity + 1;

    setCart((prev) =>
      prev.map((p) =>
        p.id === item.id
          ? { ...p, quantity: updatedQty }
          : p
      )
    );

    try {
      await axios.patch(
        `http://localhost:5000/cart/${item.id}`,
        { quantity: updatedQty }
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  // 🔥 Decrease quantity (Instant)
  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    const updatedQty = item.quantity - 1;

    setCart((prev) =>
      prev.map((p) =>
        p.id === item.id
          ? { ...p, quantity: updatedQty }
          : p
      )
    );

    try {
      await axios.patch(
        `http://localhost:5000/cart/${item.id}`,
        { quantity: updatedQty }
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  // 🔥 Remove item (Instant)
  const removeItem = async (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await axios.delete(
        `http://localhost:5000/cart/${id}`
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const clearCart = async () => {
    const current = [...cart];
    setCart([]);

    try {
      await Promise.all(
        current.map((item) =>
          axios.delete(
            `http://localhost:5000/cart/${item.id}`
          )
        )
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};