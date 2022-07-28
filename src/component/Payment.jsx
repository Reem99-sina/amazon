import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Checkout from './Checkout'
import Form from 'react-bootstrap/Form'
import { Store } from './store'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
export default function Payment() {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { shippingAddress, paymentMethod } } = state
    const [paymentMethodname, setPaymentmethod] = useState()
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping")
        }
    }, [shippingAddress])

    const submetHandler = async (e) => {
        e.preventDefault()
        ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodname })
        localStorage.setItem("paymentMethod", paymentMethodname)
        navigate("/placeorder")
    }
    return (
        <div>
            <Checkout step1 step2 step3></Checkout>
            {/* <div className='container '></div> */}
            <Helmet>
                <title>payment method</title>
            </Helmet>
            <h2 className='my-3'> payment method</h2>
            <Form onSubmit={submetHandler}>
                <div className='mb-3'>
                    <Form.Check type='radio' id='PayPal' label='PayPal' value='PayPal' checked={paymentMethodname === "PayPal"} onChange={(e) => setPaymentmethod(e.target.value)} />
                </div>
                <div className='mb-3'>
                    <Form.Check type='radio' id='Stripe' label='Stripe' value='Stripe' checked={paymentMethodname === "Stripe"} onChange={(e) => setPaymentmethod(e.target.value)} />
                </div>
                <div >
                    <Button type='submit'>continue</Button>
                </div>
            </Form >
        </div >
    )
}
