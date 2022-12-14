import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function Checkout(props) {
    return (<Row className='checkout-steps'>
        <Col className={props.step1 ? "active" : ""}>sign in</Col>
        <Col className={props.step2 ? "active" : ""}>shipping</Col>
        <Col className={props.step3 ? "active" : ""}>payment</Col>
        <Col className={props.step4 ? "active" : ""}>place order</Col>

    </Row>
    )
}
