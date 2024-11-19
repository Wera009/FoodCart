import React,{ useEffect, useState, useRef } from "react";
import CartItem from "./Cartitem";
import CartModal from "./CartModal";
import Header from "./Header";
import Checkout from "./Checkout";

export default function Meals() {
  const [availableMeals, setAvailableMeals] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [modalType, setModalType] = useState("cart");

  const modal = useRef(null);
 
  function handleCloseModal() {
    modal.current?.close();
  }
  function handleCheckout() {
    setModalType("checkout");
    modal.current?.open();
  }
  function handleOpenModal() {
    setModalType("cart");
    modal.current?.open();
  }

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch("http://localhost:3000/meals")
        if (!res.ok) {
          throw new Error("Failed to Fetch Meals");
        }
        const resData = await res.json();
        setAvailableMeals(resData);
      } catch (error) {
        console.error(error.message || 'Could not fetch meals, try again later');
      }
    }
    fetchMeals();
  }, []);


   function handleSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
  
    console.log("Cart Items:", cartItems); // Log cartItems
    console.log("Customer Data:", data);
  
    fetch("http://localhost:3000/orders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          items: cartItems,
          customer: data
        }
      }),
    })
      .then(res => res.json())  // Use the correct chaining after fetch
      .then(responseData => {
        console.log("Server Response:", responseData);  // Log the backend response
        setCartItems([]);
        setModalType("success");
        modal.current?.open()
      })
      .catch(error => {
        console.error("Error during submission:", error);
      });
  }


const handleAddToCart = (meal) => {
  setCartItems((prevCart) => {
    const existingItem = prevCart.find(item => item.id === meal.id);
    if (existingItem) {
      return prevCart.map(item =>
        item.id === meal.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prevCart, { ...meal, quantity: 1 }];
    }
  });
};

const handleUpdateQuantity = (id, delta) => {
  setCartItems((prevCart) => {
    const updatedCart = prevCart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
        : item
    )
    return updatedCart.filter(item => item.quantity > 0)
  });
};
const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

const formattedTotalPrice = `$${cartTotal.toFixed(2)}`;


return (
  <>
    <Header handleOpenCart={handleOpenModal} cartQuantity={totalCartQuantity} />

    <CartModal ref={modal}>
    {modalType === "cart" && (
          <>
            <CartItem 
              onUpdateQuantity={handleUpdateQuantity}
              items={cartItems}
              formattedTotalPrice={formattedTotalPrice}
            />
        
        <div className="modal-actions"> 
            {totalCartQuantity > 0 ? (
              <>
                <button className="text-button" onClick={handleCloseModal}>Close</button>
                <button className="button" onClick={handleCheckout}>Go to Checkout</button>
                </>
              ) : (
                <button className="text-button" onClick={handleCloseModal}>Close</button>
              )}
              </div>
          </>
        )}

    {modalType === "checkout" && (
      <Checkout cartTotal={formattedTotalPrice}
      handleCloseCheckout={handleCloseModal} 
      handleSubmit={handleSubmit} />
    )}
   
    {modalType === "success" && (
      <>
    <p>Your order was submitted successfully.Thank You</p>
    <button className="button" onClick={handleCloseModal}>OK</button>
    </>
  )}
    </CartModal>

    <ul id="meals">
      {availableMeals.map((meal) => (
        <li key={meal.id} className="meal-item">
          <article>
            <img src={`http://localhost:3000/${meal.image}`} alt="Meals" />
            <div>
              <h3>{meal.name}</h3>
              <p className="meal-item-price">${meal.price}</p>
              <p className="meal-item-description ">{meal.description}</p>
            </div>
            <p className="meal-item-actions">
              <button className="button" onClick={() => handleAddToCart(meal)}>Add to Cart</button>
            </p>
          </article>
        </li>
      ))}
    </ul>
  </>
);
}