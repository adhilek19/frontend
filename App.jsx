import './App.css'
import Approuter from './router/Approuter'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Dashboard from './admin/Dashboard'

function App() {
  const currentUser = localStorage.getItem("userId")
  const [cart, setCart] = useState([])

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/cart?userId=${currentUser}`
      )
      setCart(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchCart()
    } else {
      setCart([])
    }
  }, [currentUser])

  return (
    <>
     
     
      <Approuter cart={cart} setCart={setCart} />
   
    </>
  )
}

export default App
