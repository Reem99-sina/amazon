import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useReducer } from 'react'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from './Product'
import { Helmet } from 'react-helmet-async'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
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
export default function Home() {
    const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
        product: [],
        loading: true,
        error: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUER" })
            try {
                const result = await axios.get("/api/products")
                dispatch({ type: "FETCH_SUCCESS", payload: result.data.product })
            } catch (error) {
                dispatch({ type: "FETCH_FAILED", payload: error.message })
            }
        }
        fetchData()
    }, [])
    return (<div> <Helmet><title>Amazon</title></Helmet><h1>featured products</h1>
        <div className='products'>
            {loading ? (<Spinner animation='border' role='status'><span className='visually-hidden'>loading...</span></Spinner>) :
                error ? (<Alert variant='danger'> {error}</Alert>) : (
                    <Row>
                        {product.map((product) => <Col sm={6} key={product.slug} md={4} lg={3} className='mb-3'>
                            <Product products={product}>
                            </Product>
                        </Col>
                        )}</Row>
                )}
        </div>
    </div >
    )
}
