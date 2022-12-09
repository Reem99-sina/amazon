import React, { useContext, useEffect, useReducer } from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'
import Alert from 'react-bootstrap/esm/Alert'
import { useNavigate, useParams } from 'react-router-dom'
import { Store } from './store'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Link } from 'react-router-dom'
import { usePayPalScriptReducer, PayPalButtons } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'

export default function Order() {
    let navigate = useNavigate()
    const { state } = useContext(Store)
    const { userInfo } = state;
    const params = useParams()
    const { id: orderId } = params
    const reducer = (state, action) => {
        switch (action.type) {
            case "FETCH_REQUEST":
                return { ...state, loading: true, error: '' }
            case "FETCH_SUCCESS":
                return { ...state, loading: false, order: action.payload, error: '' }
            case "FETCH_FALIED":
                return { ...state, loading: false, error: action.payload }
            case "PAY_REQUEST":
                return { ...state, loadingPay: true }
            case "PAY_SUCCESS":
                return { ...state, loadingPay: false, successPay: true }
            case "PAY_FAIL":
                return { ...state, loadingPay: false }
            case "PAY_RESET":
                return { ...state, loadingPay: false, successPay: false }
            default:
                return state;
        }
    }
    const [{ loading, error, order, loadingPay, successPay }, dispatch] = useReducer(reducer, {
        order: {},
        loading: true,
        error: "",
        loadingPay: false, successPay: false
    })
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`https://amazon99.herokuapp.com/api/orders/${orderId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.userToken}`
                    }
                })
                console.log(data)
                dispatch({ type: "FETCH_SUCCESS", payload: data.order })
            } catch (error) {
                dispatch({ type: "FETCH_FALIED", payload: error })

            }
        }
        if (!userInfo) {
            return navigate("/amazon/login")
        }
        if (!order._id || successPay || order._id !== orderId) {
            fetchOrder()
            if (successPay) {
                dispatch({ type: "PAY_RESET" })
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get("https://amazon99.herokuapp.com/api/keys/paypal/", {
                    headers: {
                        authorization: `Bearer ${userInfo.userToken}`
                    }
                })
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending'
                })
            }
            loadPaypalScript()
        }
    }, [order, orderId, userInfo, paypalDispatch])
    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: order.totalPrice }
                }
            ]
        }).then((orderID) => { return orderID })
    }
    async function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: "PAY_REQUEST" })
                const { data } = await axios.put(`/api/orders/${order._id}/pay`, details,
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.userToken}`
                        }
                    })
                dispatch({ type: "PAY_SUCCESS", payload: data })
                toast.success("order is paid")

            } catch (error) {
                dispatch({ type: "PAY_FAIL", payload: error })
                toast.error(error.message)
            }
        })
    }
    function onError(error) {
        toast.error(error)
    }
    return (
        loading ? (<Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner>) : error ? (<Alert variant='danger'> {error}</Alert>)
            : (<div>
                <Helmet>
                    <title>{`order ${orderId}`}</title>
                </Helmet>
                <h2 className="mb-3">{`order ${orderId}`}</h2>
                <Row>
                    <Col md={8}>
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>shipping</Card.Title>
                                <Card.Text>
                                    <strong>Name:</strong>{order.shippingAddress.fullName}<br />
                                    <strong>address:</strong>{order.shippingAddress.address}<br />
                                    {order.shippingAddress.city},{order.shippingAddress.postalcode},{order.shippingAddress.country}
                                </Card.Text>
                                {order.isDelivered ? <Alert variant='success'>Delivered at {order.deliveredAt}</Alert> : <Alert variant='danger'>
                                    not delivered
                                </Alert>}
                            </Card.Body>
                        </Card>
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>payment</Card.Title>
                                <Card.Text>
                                    <strong>Method:</strong>{order.paymentMethod}<br />
                                </Card.Text>
                                {order.isPaid ? <Alert variant='success'>paided at {order.paidAt}</Alert> : <Alert variant='danger'>
                                    not paid
                                </Alert>}
                            </Card.Body>
                        </Card>
                        <Card className='mb-3'>
                            <Card.Title>items</Card.Title>
                            <Card.Body>
                                <ListGroup>
                                    {order.orderItems.map((item) => (
                                        // console.log(item);
                                        <ListGroup.Item key={item._id} >
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />{" "}
                                                    <Link to={`/amazon/product/slug/${item.slug}`}>{item.name}</Link>
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
                                <Link to='/amazon/cart'>edit</Link>
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
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>shipping</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Order total</strong></Col>
                                            <Col><strong>${order.totalPrice}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {!order.isPaid && (<ListGroup.Item>{isPending ? (<Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner>) :
                                        (<div>
                                            <PayPalButtons createOrder={createOrder}
                                                onApprove={onApprove} onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                        )}{loadingPay && (<Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner>)}
                                    </ListGroup.Item>)}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </div>)
    )
}
