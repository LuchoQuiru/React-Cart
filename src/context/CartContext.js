import React from 'react';
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {  //Inicializo
        try{ 
            const productosEnLocalStorage = localStorage.getItem("cartProducts")
            return productosEnLocalStorage ? JSON.parse(productosEnLocalStorage) : []
        } catch(error){
            return []
        }
    })

    useEffect(() => { //Es invocado cuando se actualiza el objeto en el DOM (el cartItems)
        localStorage.setItem("cartProducts" , JSON.stringify(cartItems))
    }, [cartItems]);


    const addItemToCart = (product) => {
        //Busco el item (product) en la coleccion de items que tengo en la storage (osea que formaran parte de un pedido)
        const inCart = cartItems.find(
            (productInCart) => productInCart.id === product.id
        ) 

        if(inCart){//Si encontre el item, aumento la cantidad (amount)
            setCartItems(
                cartItems.map((productInCart) => {
                    if(productInCart.id === product.id){
                        return {...inCart, amount: inCart.amount + 1}
                    }else return productInCart
                })
            )
        }
        else{ //Si no encontre el item, agrego el item (product) a la coleccion de items en la session
            setCartItems([...cartItems, {...product, amount: 1}])
        }
    
    };
    
    const deleteItemToCart = (product) => {
        const inCart = cartItems.find(
            (productInCart) => productInCart.id === product.id
        );

        if(inCart && inCart.amount === 1){
            setCartItems(
                cartItems.filter((productInCart) => productInCart.id !== product.id)
            )
        }else{  
            setCartItems(
                cartItems.map((productInCart) => {
                if(productInCart.id === product.id){
                    return {...inCart, amount: inCart.amount - 1}
                }
                else return productInCart;
            }));
        }

        //Actualizar la tabla de productos desde localstorage
        const productos = JSON.parse(localStorage.getItem('productos'))
        const productos_actualizados = productos.map((producto) => {          
            if (producto.id === product.id) {
              return { ...producto, stock: (product.stock) }
            }
            else return producto;
        })
        localStorage.setItem('productos',JSON.stringify(productos_actualizados))
    };

    const cleanCart = () => {
        setCartItems([])
    }

    return(
        <CartContext.Provider value={{ cartItems, addItemToCart, deleteItemToCart, cleanCart}}>
            {children}
        </CartContext.Provider>
    );
};

