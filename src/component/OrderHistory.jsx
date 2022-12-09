import React, { useContext, useEffect, useReducer } from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'
import Alert from 'react-bootstrap/esm/Alert'

import { Helmet } from 'react-helmet-async'
import { Store } from './store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/esm/Button'

export default function OrderHistory() {
    const { state } = useContext(Store)
    const { userInfo } = state;
    const navigate = useNavigate();
    const reducer = (state, action) => {
        switch (action.type) {
            case "FETCH_REQUEST":
                return { ...state, loading: true, error: '' }
            case "FETCH_SUCCESS":
                return { ...state, loading: false, orders: action.payload }
            case "FETCH_FALIED":
                return { ...state, loading: false, error: action.payload }
            default:
                return state
        }
    }
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        order: {},
        loading: true,
        error: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            console.log(userInfo)
            try {
                const { data } = await axios.get("https://amazon99.herokuapp.com/api/orders/mine", {
                    headers: { Authorization: `Bearer ${userInfo.userToken}` }
                })
                console.log(data)
                dispatch({ type: "FETCH_SUCCESS", payload: data.orders })
            } catch (error) {
                dispatch({ type: "FETCH_FALIED", payload: error })

            }
        }
        fetchData()
    }, [userInfo])
    return (
        <div>
            <Helmet>
                <title>our history</title>
            </Helmet>
            <h2>our History</h2>
            {loading ? (
                <Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span>
                </Spinner>) : error ? (<Alert variant='danger'> {error}</Alert>)
                : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) =>
                            (<tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt : "no"}</td>
                                <td>{order.isDelivered ? order.deliveredAt : "no"}</td>
                                <td>
                                    <Button type="button" variant='light' onClick={() => { navigate(`/amazon/order/${order._id}`) }}>Details</Button>
                                </td>

                            </tr>)
                            )}
                        </tbody>
                    </table>
                )}
        </div>
    )
}
