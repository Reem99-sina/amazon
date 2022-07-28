import { createContext } from "react";
import { useReducer } from 'react'
export const Store = createContext()
const initialState = {
    userInfo: localStorage.getItem('usersignin') ? JSON.parse(localStorage.getItem('usersignin')) : null,
    cart: {
        shippingAddress: localStorage.getItem("addshipping") ? JSON.parse(localStorage.getItem("addshipping")) : {}
        , paymentMethod: localStorage.getItem("paymentMethod") ? JSON.stringify(localStorage.getItem("paymentMethod")) : ''
        , cartItem: localStorage.getItem('cartItem') ? JSON.parse(localStorage.getItem('cartItem')) : []
    },
}
function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            const newItem = action.payload;
            const existItem = state.cart.cartItem.find((item) => item._id === newItem._id);
            const cartItem = existItem ? state.cart.cartItem.map((item) => item._id === newItem._id ? newItem : item) : [...state.cart.cartItem, newItem]
            localStorage.setItem("cartItem", JSON.stringify(cartItem))
            return { ...state, cart: { ...state.cart, cartItem } }
        case 'REMOVE_ITEM': {
            const cartItem = state.cart.cartItem.filter((item) => item._id !== action.payload._id);
            return { ...state, cart: { ...state.cart, cartItem } }
        }
        case 'USER_SIGNIN': {
            return { ...state, userInfo: action.payload }
        }
        case 'USER_SIGNOUT': {
            return { ...state, userInfo: null, cart: { cartItem: [], shippingAddress: {}, paymentMethod: "" } }
        }
        case "ADD_SHIPPING_PRODUCT": {
            return { ...state, cart: { ...state.cart, shippingAddress: action.payload } }
        }
        case "SAVE_PAYMENT_METHOD": {
            return { ...state, cart: { ...state.cart, paymentMethod: action.payload } }
        }
        case "CARD_CLEAR":{
            return { ...state, cart: { ...state.cart, cartItem:[] } }

        }
        default:
            return state;
    }
}
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = { state, dispatch }

    return <Store.Provider value={value}>{props.children}</Store.Provider>
}