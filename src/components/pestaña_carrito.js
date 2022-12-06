import React from 'react';
import { CartProvider } from '../context/CartContext';
import TablaPedido from '../context/tablaPedido';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from 'react-bootstrap';

const Carrito = (props) => {

    const { isAuthenticated } = useAuth0()

    if (!isAuthenticated) {
        return (
            <Alert>
                <div>Es necesario estar logueado!</div>
            </Alert>
        )
    }

    else {
        return (
            <CartProvider>
                <TablaPedido idUser={props.idUser} />
            </CartProvider>
        )
    }

}

export default Carrito