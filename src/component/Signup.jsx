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
export default function Signup() {
    let navigate = useNavigate()
    const [userName, setuserName] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const { search } = useLocation()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : '/'
    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmpassword) {
            toast.error("password do not match")
            return;
        }
        // try {
        const { data } = await axios.post("/api/users/signup", {
            userName, email, password
        })
        if (data.error) {
            console.log(data.email)

            toast.error(`user have this email`)
            return;
        }
        ctxDispatch({ type: "USER_SIGNIN", payload: data })
        if (data) {
            localStorage.setItem("usersignin", JSON.stringify(data))
            navigate(redirect || "/")
        } else {
            toast.error(`no user have this email`)
        }
        // } catch (error) {
        //     toast.error(`invalid email or password ${error}`)
        // }
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <Container className='small-container'>
            <Helmet>
                <title>signup</title>
            </Helmet>
            <h2 className='my-4'>sign up</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>name</Form.Label>
                    <Form.Control type="text" required onBlur={(e) => { setuserName(e.target.value) }} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onBlur={(e) => { setemail(e.target.value) }} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control type="password" required onBlur={(e) => { setpassword(e.target.value) }} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>confirm password</Form.Label>
                    <Form.Control type="password" required onBlur={(e) => { setconfirmpassword(e.target.value) }} />

                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'> sign up</Button>
                </div>
                <div className='mb-3'>
                    Already have an account? {" "}
                    <Link to={`/signin?redirect=${redirect}`}> signin</Link>
                </div>
            </Form>
        </Container>
    )
}

