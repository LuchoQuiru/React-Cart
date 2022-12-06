import React, { useState } from "react";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NavBar } from "./layouts/navbar";
import Oferta from "./components/pestaña_oferta"
import Carrito from "./components/pestaña_carrito"
import Producto from "./components/pestaña_producto"
import PedidosDelUsuario from "./components/pestaña_pedidos";

export function App(){
    //const[loggedUser, setLoggedUser] = useState(null)
    const[idUser , setIdUser] = useState(null)

    return(
        <div>
            <BrowserRouter>
            <Routes>
                <Route path='/' element={ <NavBar setIdUser = {setIdUser} /> }>                    
                    <Route path='/ofertas' element={ <Oferta />}> </Route> 
                    <Route path='/productos' element={ <Producto />}> </Route> 
                    <Route path='/carrito' element={ <Carrito idUser = {idUser}/>}> </Route> 
                    <Route path='/pedidos' element={ <PedidosDelUsuario idUser = {idUser} />}> </Route> 
                </Route>
            </Routes>
            </BrowserRouter>
        </div>
    );
};