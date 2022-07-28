import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Store } from './store'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import axios from 'axios';
export default function ProfileScreen() {
    const reducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_REQUEST':
                return { ...state, loadingUpdate: true }
            case 'UPDATE_SUCCESS':
                return { ...state, loadingUpdate: false }
            case 'UPDATE_FAILED':
                return { ...state, loadingUpdate: false }
            default:
                return state;
        }
    }
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [userName, setName] = useState(userInfo.userName);
    const [email, setemail] = useState(userInfo.email);
    const [password, setpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false
    })
    const sumbitHandler = async (e) => {
        e.preventDefault()
        // console.log(userInfo.user.userName)
        try {
            const { data } = await axios.put("/api/users/profile", {
                userName, email, password
            }, { headers: { Authorization: `Bearer ${userInfo.userToken}` } })
            console.log(data)
            dispatch({ type: "UPDATE_SUCCESS" })
            ctxDispatch({ type: "USER_SIGNIN", payload: data })
            localStorage.setItem("usersignin", JSON.stringify(data))
            console.log(data)
            toast.success('user success update')
        } catch (error) {
            dispatch({ type: "UPDATE_FAILED" })
            toast.error(error)
        }
    }
    return (
        <div>
            <Helmet>
                <title>profileScreen</title>
            </Helmet>
            <h2 className='my-3'>our profile</h2>
            <Form onSubmit={sumbitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>
                        name
                    </Form.Label>
                    <Form.Control value={userName} onChange={(e) => setName(e.target.value)} required />

                </Form.Group>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>
                        email
                    </Form.Label>
                    <Form.Control value={email} onChange={(e) => setemail(e.target.value)} required />

                </Form.Group>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>
                        password
                    </Form.Label>
                    <Form.Control value={password} onChange={(e) => setpassword(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>
                        confirm password
                    </Form.Label>
                    <Form.Control value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} />
                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'>update</Button>
                </div>
            </Form>

        </div >
    )
}
