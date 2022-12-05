import React, { useEffect, useState, useReducer } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';
import CartItem from './CartItem.js';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, products: action.payload };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


function CartGrid() {
    const [{ loading }, dispatch] = useReducer(reducer, {
        products: [],
        loading: false,
        error: false,
    });

    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            const Data = await axios({
                method: 'GET',
                url: 'http://localhost:3001/cart',
            }).catch((err) => {
                dispatch({ type: "FETCH_ERROR", payload: err });
            });
            setCart(Data.data);
            setCartItems(Data.data[0].cartItems);
            dispatch({ type: "FETCH_SUCCESS", payload: Data.data });
        };
        fetchData();
    }, [setCart]);


    // Card components creation:
    const Items = cartItems.map((product) => {
        return (
            <MDBCol key={product._id} size='4' sm={4} lg={4} xl={4} xxl={4}>
                <CartItem key={product._id} items={product} />
            </MDBCol>
        )
    });


    // Seperate To Rows:
    var final = [];
    for (let i = 0; i < Items.length; i + 3) {
        const slice = Items.splice(0, 3);
        final.push(<MDBRow className={"Row" + i} key={i++}>{slice}</MDBRow>);
    }

    return (
        <MDBContainer className='mt-3'>
            <MDBRow className='mb-3'>
                {loading ? <h1>Loading...</h1> : final}
            </MDBRow>
        </MDBContainer>
    );
};

export default CartGrid;