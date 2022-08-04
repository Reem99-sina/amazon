import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import Checkout from './Checkout'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { Store } from './store'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Alert from 'react-bootstrap/esm/Alert'
import Spinner from 'react-bootstrap/esm/Spinner'
export default function Placeorder() {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const reducer = (state, action) => {
        switch (action.type) {
            case 'CREATE_REQUEST':
                return { ...state, loading: true }
            case 'CREATE_SUCCESS':
                return { ...state, loading: false }
            case 'CREATE_fail':
                return { ...state, loading: false }
            default:
                return state
        }
    }
    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: true
    })
    const { cart: { shippingAddress, paymentMethod, cartItem }, userInfo } = state
    const { cart } = state
    console.log(cartItem)

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    cart.itemsPrice = round2(
        cart.cartItem.reduce((a, c) => a + c.quantity * c.price, 0)
    )
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10)
    cart.taxPrice = round2(0.15 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice
    useEffect(() => {
        if (!paymentMethod) {
            navigate('/payment')
        }
    })
    const placeOrderHandler = async () => {
        try {
            dispatch({ type: "CREATE_SUCCESS" })
            const { data } = await axios.post('https://amazon99.herokuapp.com/api/orders/', {
                orderItems: cart.cartItem,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }, {
                headers: {
                    Authorization: `Bearer ${userInfo.userToken}`
                }
            }
            )
            ctxDispatch({ type: "CARD_CLEAR" })
            dispatch({ type: "CREATE_SUCCESS" })
            localStorage.removeItem("cartItem")
            navigate(`/order/${data.order._id}`)
        } catch (error) {
            dispatch({ type: "CREATE_fail" })
            toast.error(`error${error}`)
        }
    }
    return (
        <div>
            <Checkout step1 step2 step3 step4></Checkout>
            <Helmet>
                <title>Preview order</title>
            </Helmet>
            <h2 className='my-3'>Preview order</h2>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong>{shippingAddress.fullName}<br />
                                <strong>address:</strong>{shippingAddress.address}<br />
                                {shippingAddress.city},{shippingAddress.postalcode},{shippingAddress.country}
                            </Card.Text>
                            <Link to='/shipping'>edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong>{paymentMethod}<br />
                            </Card.Text>
                            <Link to='/payment'>edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Title>items</Card.Title>
                        <Card.Body>
                            <ListGroup>
                                {cartItem.map((item) => (
                                    // console.log(item);
                                    <ListGroup.Item key={item._id} >
                                        <Row className='align-items-center'>
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />{" "}
                                                <Link to={`/product/slug/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>
                                                ${item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>)
                                )}
                            </ListGroup>
                            <Link to='/cart'>edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Sumary</Card.Title>
                            <ListGroup variant="fluish">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Order total</strong></Col>
                                        <Col><strong>${cart.totalPrice}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button type='button' onClick={placeOrderHandler} disabled={cartItem.length === 0}>
                                            Place order
                                        </Button>
                                    </div>
                                    {loading && <Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    )
}
