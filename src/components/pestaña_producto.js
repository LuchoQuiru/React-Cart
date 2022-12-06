import React from 'react';
import { CartProvider } from '../context/CartContext';
import TablaProductos from '../context/tablaProductos';

const Producto = () => {
    return(
        <CartProvider>
            <TablaProductos />
        </CartProvider>   
    )
}

export default Producto
