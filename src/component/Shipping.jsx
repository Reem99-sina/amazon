import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Store } from './store'
import { useNavigate } from 'react-router-dom'
import Checkout from './Checkout'
export default function Shipping() {
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { shippingAddress }, userInfo } = state
    const [fullName, setFullName] = useState(shippingAddress.fullName || "")
    const [address, setaddress] = useState(shippingAddress.address || "")
    const [city, setcity] = useState(shippingAddress.city || "")
    const [postalcode, setpostalcode] = useState(shippingAddress.postalcode || "")
    const [country, setcountry] = useState(shippingAddress.country || "")
    const navigate = useNavigate()
    useEffect(() => {
        if (!userInfo) {
            navigate("/amazon/signin")
        }
    }, [userInfo])
    const submitshipping = (e) => {
        e.preventDefault()
        ctxDispatch({
            type: "ADD_SHIPPING_PRODUCT",
            payload: {
                fullName, address, city, postalcode, country
            }
        })
        localStorage.setItem("addshipping", JSON.stringify({ fullName, address, city, postalcode, }))
        navigate("/amazon/payment")
    }
    return (<>country
        <Helmet>
            <title>Shipping addressing </title>
        </Helmet>
        <h3 className='my-3'>Shipping addressing </h3>
        <Checkout step1 step2></Checkout>
        <Form onSubmit={submitshipping}>
            <Form.Group className='my-3' controlId='fullName'>
                <Form.Label>fullName</Form.Label>
                <Form.Control value={fullName} onChange={((e) => { setFullName(e.target.value) })} required />
            </Form.Group>
            <Form.Group className='my-3' controlId='fullName'>
                <Form.Label>address</Form.Label>
                <Form.Control value={address} onChange={((e) => { setaddress(e.target.value) })} required />
            </Form.Group>
            <Form.Group className='my-3' controlId='fullName'>
                <Form.Label>city</Form.Label>
                <Form.Control value={city} onChange={((e) => { setcity(e.target.value) })} required />
            </Form.Group>
            <Form.Group className='my-3' controlId='fullName'>
                <Form.Label>postalcode</Form.Label>
                <Form.Control value={postalcode} onChange={((e) => { setpostalcode(e.target.value) })} required />
            </Form.Group>
            <Form.Group className='my-3' controlId='fullName'>
                <Form.Label>country</Form.Label>
                <Form.Control value={country} onChange={((e) => { setcountry(e.target.value) })} required />
            </Form.Group>
            <h3 className='mb-3'>
                <Button variant='primary' type='submit'>
                    Continue
                </Button>
            </h3>
        </Form>
    </>
    )
}
