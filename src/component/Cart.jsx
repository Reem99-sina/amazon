import React, { useContext } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Helmet } from 'react-helmet-async'
import { Store } from './store'
import Alert from 'react-bootstrap/Alert'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import axios from 'axios'

export default function Cart() {
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : '/'
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { cartItem } } = state
    console.log(cartItem)
    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert("Sorry,Product is out of stock");
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
    }
    const removeItem = async (item) => {
        ctxDispatch({
            type: "REMOVE_ITEM",
            payload: item
        })
    }
    const checkOut = () => {
        navigate(`/shipping?redirect=${redirect}`)
    }
    return (<div>
        <Helmet>
            <title>shopping cart</title>
        </Helmet>
        <Row>
            <Col md={8}>
                {cartItem.length === 0 ? (
                    <Alert variant='danger' >
                        Cart is empty. <Link to="/">Go Shopping</Link>
                    </Alert>
                ) : (

                    <ListGroup>
                        {cartItem.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row className="align-items-center">
                                    <Col md={4}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="img-fluid rounded img-thumbnail"
                                        ></img>{' '}
                                        <Link to={`/product/slug/${item.slug}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={3}>
                                        <Button
                                            variant="light"
                                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                                            disabled={item.quantity === 1}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                        </Button>{' '}
                                        <span>{item.quantity}</span>{' '}
                                        <Button
                                            variant="light"
                                            disabled={item.quantity === item.countInStock}
                                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                        </Button>
                                    </Col>
                                    <Col md={3}>${item.price}</Col>
                                    <Col md={2}>
                                        <Button
                                            variant="light"
                                            onClick={() => removeItem(item)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <ListGroup.Item variant='flush'>
                            <h3>
                                Subtotal({cartItem.reduce((a, c) => a + c.quantity, 0)}{' '}
                                items):$
                                {cartItem.reduce((a, c) => a + c.price * c.quantity, 0)}{''}
                            </h3>
                        </ListGroup.Item>
                        <ListGroup.Item >
                            <div className='d-grid'>
                                <Button type='button' onClick={checkOut} variant='primary' disabled={cartItem.length === 0}>
                                    Proceed to checkout
                                </Button>
                            </div>
                        </ListGroup.Item>
                    </Card.Body>
                </Card>

            </Col>
        </Row>
    </div >
    )
}
