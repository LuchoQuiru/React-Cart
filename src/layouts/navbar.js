import React, { useEffect } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { Token } from "../variables.js";
import { url_produccion } from "../variables.js";

export function NavBar(props) {
    const {isAuthenticated,user,logout, loginWithPopup} = useAuth0()
    
    let botonUser;
    if (isAuthenticated) {
        botonUser = (<NavDropdown align={"end"} title={user.nickname}>            
            <NavDropdown.Item as={Link} to="/pedidos">Mis pedidos</NavDropdown.Item>
            <NavDropdown.Item onClick={() => { logout({ returnTo: window.location.origin })}}>Salir</NavDropdown.Item>
        </NavDropdown>)
    }
    else{
        botonUser = <Nav.Link key="99" onClick={loginWithPopup}>Ingresar</Nav.Link>;
    }

    useEffect(()=>{
        if(isAuthenticated){
            checkInLaravel()
        }
    },[isAuthenticated])
        
    const checkInLaravel = async () => {
        
        var email
        if (isAuthenticated) {
            email = user.email
            //Chequeo si existe en la base de datos de laravel
            var URL = url_produccion + '/usuarios/' + email
            var requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': Token },
            }
    
            var response = await fetch(URL, requestOptions)
            var data = await response.json();
            
            //Si no lo encuentro en la base de datos de laravel lo agrego

            if (data.length === 0) {
                console.log("Entre a data=0")
                URL = url_produccion + '/usuarios'
                requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': Token },
                    body: JSON.stringify({ "email": email })
                }
                response = await fetch(URL, requestOptions)
                data = await response.json();
                
            }
            props.setIdUser(data[0].id)
        }
    }
    

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>
                        Distribuidora
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/ofertas"> <div className="font2"> Ofertas!</div></Nav.Link>
                        <Nav.Link as={Link} to="/productos" ><div className="font2"> Productos</div></Nav.Link>
                        <Nav.Link as={Link} to="/carrito" ><div className="font2"> Carrito</div></Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                    <Nav>
                        {botonUser}
                    </Nav>
                </Container>
            </Navbar>

            <section>
                <Outlet></Outlet>
            </section>
        </>
    );
};