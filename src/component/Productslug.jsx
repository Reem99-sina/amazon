import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import Rating from './Rating';
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async';
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { Store } from './store';
import { useNavigate } from 'react-router-dom';
export default function Productslug() {
    const navigate = useNavigate()
    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_REQUER':
                return { ...state, loading: true };
            case 'FETCH_SUCCESS':
                return { ...state, product: action.payload, loading: false };
            case 'FETCH_FAILED':
                return { ...state, error: action.payload, loading: false };
            default:
                return state
        }
    }
    const params = useParams()
    const { slug } = params
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ""
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUER" })
            try {
                const result = await axios.get(`https://amazon99.herokuapp.com/api/products/slug/${slug}`)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
                // localStorage.setItem("payload", result.data)
            } catch (error) {
                dispatch({ type: "FETCH_FAILED", payload: error.message })
            }
        }
        fetchData()
    }, [slug])
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart } = state
    const addtoCart = async () => {
        const existItem = cart.cartItem.find((x) => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`https://amazon99.herokuapp.com/api/products/${product._id}`)
        // localStorage.setItem("payload", data)
        if (data.countInStock < quantity) {
            window.alert('sorry, product is out stock')
            return;
        }
        ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
        navigate("/cart")
    }
    return (
        loading ? <Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner> : error ? <Alert variant='danger'> {error}</Alert> :
            localStorage.getItem("payload") ?
                <div><Row>
                    <Col md={6}>
                        <img className='img-large' src={localStorage.getItem("payload").image} alt={localStorage.getItem("payload").name} />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>{localStorage.getItem("payload").name}</h2>
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating rating={localStorage.getItem("payload").rating} numReviews={localStorage.getItem("payload").numReviews}></Rating>
                            </ListGroup.Item>
                            <ListGroup.Item>Price:${localStorage.getItem("payload").price}</ListGroup.Item>
                            <ListGroup.Item>Description:<p>{localStorage.getItem("payload").description}</p></ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>

                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:
                                    </Col>
                                    <Col>${localStorage.getItem("payload").price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:
                                    </Col>
                                    <Col>{localStorage.getItem("payload").countInStock > 0 ? <Badge bg='success'>in stock</Badge> : <Badge bg='danger'>not validation</Badge>}</Col>
                                </Row>
                            </ListGroup.Item>

                            {localStorage.getItem("payload").countInStock > 0 &&
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button onClick={addtoCart} variant='primary'>
                                            addto chart</Button></div>
                                </ListGroup.Item>}

                        </ListGroup>
                    </Col>
                </Row></div>
                : <div><Row>
                    <Col md={6}>
                        <img className='img-large' src={product.image} alt={product.name} />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>{product.name}</h2>
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                            </ListGroup.Item>
                            <ListGroup.Item>Price:${product.price}</ListGroup.Item>
                            <ListGroup.Item>Description:<p>{product.description}</p></ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>

                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:
                                    </Col>
                                    <Col>${product.price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:
                                    </Col>
                                    <Col>{product.countInStock > 0 ? <Badge bg='success'>in stock</Badge> : <Badge bg='danger'>not validation</Badge>}</Col>
                                </Row>
                            </ListGroup.Item>

                            {product.countInStock > 0 &&
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button onClick={addtoCart} variant='primary'>
                                            addto chart</Button></div>
                                </ListGroup.Item>}

                        </ListGroup>
                    </Col>
                </Row></div>
    )
}
