
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from './Rating'
import axios from 'axios'
import { Store } from './store'

export default function Product(props) {
    const { products } = props
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { cartItem } } = state
    const addtocart = async (item) => {
        const existed = cartItem.find((x) => x._id === products._id)
        const quantity = existed ? existed.quantity + 1 : 1;
        const { data } = await axios.get(`https://amazon99.herokuapp.com/api/products/${products._id}`)
        if (data.countInStock < quantity) {
            window.alert("sorry ,product out of stock");
            data.countInStock = 0;
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
    }
    return (
        <Card className="product" >
            <Link to={`/amazon/product/slug/${products.slug}`}>
                <img src={products.image} className='card-img-top' alt={products.name} />
            </Link>
            <Card.Body>
                <div className='product-info'>
                    <Card.Title>{products.name}</Card.Title>
                    <Rating rating={products.rating} numReviews={products.numReviews}></Rating>
                    <Card.Text>{products.price}</Card.Text>
                    {products.countInStock === 0 ? (
                        <Button variant="light" disabled>
                            Out of stock
                        </Button>
                    ) : (<Button onClick={() => addtocart(products)}> add to charts</Button>
                    )}

                </div>
            </Card.Body>
        </Card>
    )
}
