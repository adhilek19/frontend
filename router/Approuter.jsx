import Login from '../pages/Login'
import Register from '../pages/Register'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Product from '../pages/Product'
import Cart from '../pages/Cart'
import Order from '../pages/Order'
import Orders from '../pages/orders'
import Dashboard from '../admin/Dashboard'
import Morders from '../admin/Morders'
import Mproducts from '../admin/Mproducts'
import Musers from '../admin/Musers'
import Alogin from '../admin/Alogin'
import ProtectedRoute from '../admin/ProtectedRoute'
import Navbar from '../navbar/Navbar'
import Footer from '../navbar/Footer'









function Approuter({ cart, setCart }) {
  return (
    <Routes>
      <Route path='/' element={<><Navbar cartCount={cart.length}/><Home /> <Footer/></>} />
      <Route path='/register' element={<><Navbar cartCount={cart.length}/><Register /> <Footer/></>} />
      <Route path='/login' element={<><Navbar cartCount={cart.length}/><Login /><Footer/></>} />
      <Route path='/product' element={<><Navbar cartCount={cart.length}/><Product /><Footer/></>} />

  
      <Route
        path='/cart'
        element={<><Navbar cartCount={cart.length}/><Cart cart={cart} setCart={setCart} /><Footer/></>}/>

      <Route path='/order' element={<><Navbar cartCount={cart.length}/><Order /> <Footer/></>} />
      <Route path='/orders' element={<><Navbar cartCount={cart.length}/><Orders />  <Footer/></>}/>



      <Route path='/admin' element={<Alogin/>} />

      <Route path='/admin/dashboard' element={
        <ProtectedRoute><Dashboard/> </ProtectedRoute>} />
      <Route path='/admin/products' element={<ProtectedRoute><Mproducts /> </ProtectedRoute>} />
      <Route path='/admin/orders' element={ <ProtectedRoute><Morders /> </ProtectedRoute>} />
   


      <Route path='/admin/users' element={<ProtectedRoute><Musers/> </ProtectedRoute>}/>





    </Routes>

    
  )
}

export default Approuter
