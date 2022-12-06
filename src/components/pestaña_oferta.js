import React, { useState, useEffect } from "react"
import { Carousel, Container } from "react-bootstrap"
import { Token, url_produccion} from "../variables.js"
import Spinner from "react-bootstrap/Spinner"

const Oferta = () => {
    //Configuro los hooks
    const [ofertas, setOfertas] = useState([])
    const URL = url_produccion + '/ofertas';
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 
                    'Authorization' : Token
        }
    }

    const getOfertas = async () => {
        const response = await fetch(URL, requestOptions)
        const data = await response.json();
        setOfertas(data)
    }

    useEffect(() => {
        getOfertas()
    }, [])

    if(ofertas.length === 0 ){
        return(
            <div>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }
  
    return (
        <div className="contenedor2">
            <Container fluid="md">
                <Carousel>
                {
                    ofertas.map((oferta, i) => (
                    <Carousel.Item key={i}>
                        <div className='contenedor1'>
                            <div className="fontofertas">{oferta.nombre_producto}</div>
                            <div className="fontofertas">{"Descuento: " + oferta.descuento+ "%"}</div>
                            <div className="fontofertas">{"Oferta valida hasta " + new Date(oferta.fecha_fin).toISOString().substring(0,10)}</div>
                        </div>
                        <div className="contenedor2">
                        <img
                            src={`${oferta.imagen}`} 
                            width ="300"
                            height="300"
                            alt=""/>
                        </div>
                    </Carousel.Item>))  
                }
                </Carousel>
            </Container>
        </div>

    )
}

export default Oferta