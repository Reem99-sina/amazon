import Button from 'react-bootstrap/Button'
import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import { Store } from './store'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { jwt } from 'jsonwebtoken'

export default function Signin() {
    let navigate = useNavigate()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const { search } = useLocation()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : '/'
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post("https://amazon99.herokuapp.com/api/users/signin", {
                email, password
            })
            ctxDispatch({ type: "USER_SIGNIN", payload: data })
            if (data.user) {
                localStorage.setItem("usersignin", JSON.stringify(data))
                navigate(redirect || "/")
            } else {
                toast.error(`no user have this email`)
            }
        } catch (error) {
            console.log(error)
            toast.error(`invalid email or password ${error}`)
        }
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <Container className='small-container'>
            <Helmet>
                <title>signin</title>
            </Helmet>
            <h2 className='my-4'>sign in</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onBlur={(e) => { setemail(e.target.value) }} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control type="password" required onBlur={(e) => { setpassword(e.target.value) }} />

                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'> sign in</Button>
                </div>
                <div className='mb-3'>
                    New customer? {" "}
                    <Link to={`/amazon/signup?redirect=${redirect}`}> create new customer</Link>
                </div>
            </Form>
        </Container>
    )
}
