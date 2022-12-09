import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './component/Home';
import Productslug from './component/Productslug';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import React from 'react';
import { Store } from './component/store';
import Cart from './component/Cart';
import Signin from './component/Signin';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Shipping from './component/Shipping';
import Signup from './component/Signup';
import Payment from './component/Payment';
import Placeorder from './component/Placeorder';
import Order from './component/Order';
import OrderHistory from './component/OrderHistory';
import ProfileScreen from './component/ProfileScreen';
import io from "socket.io-client";
const socket = io('https://amazon99.herokuapp.com/');
function App() {
  const [response] = React.useState("");
  React.useEffect(() => {
    console.log(response)
    return () => socket.disconnect();
  }, [response]);
  const { state, dispatch: ctxdispatch } = React.useContext(Store)
  const { cart, userInfo } = state
  const signouthandler = () => {
    ctxdispatch({ type: "USER_SIGNOUT" })
    localStorage.removeItem('usersignin')
    localStorage.removeItem('addshipping')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg='dark' variant='dark' expand="lg">
            <Container className='mt-4'>
              <LinkContainer to='/'>
                <Navbar.Brand>
                  amazon
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto'><Link to="/cart" className='nav-link'>
                  cart
                  {cart.cartItem.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItem.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.user?.userName} id='basic-nav-dropdowm'>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>user profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>order history</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className='dropdown-top' to="#signout" onClick={signouthandler}>signout</Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to='/signin'>
                      sign in
                    </Link>
                  )}
                </Nav></Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path='/amazon/' element={<Home />} />
              <Route path='*' element={<Home />} />
              <Route path='/amazon/product/slug/:slug' element={<Productslug />} />
              <Route path='/amazon/signin' element={<Signin />} />
              <Route path='/amazon/cart' element={<Cart />} />
              <Route path='/amazon/shipping' element={<Shipping />} />
              <Route path='/amazon/signup' element={<Signup />} />
              <Route path='/amazon/payment' element={<Payment />} />
              <Route path='/amazon/placeorder' element={<Placeorder />} />
              <Route path='/amazon/order/:id' element={<Order />} />
              <Route path='/amazon/orderhistory' element={<OrderHistory />} />
              <Route path='/amazon/profile' element={<ProfileScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>all series</footer>
      </div >
    </BrowserRouter>

  )
}
export default App;