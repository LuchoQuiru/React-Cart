import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import {url_produccion, Token } from "../variables.js";

const columnas = [
    {
        name: 'PEDIDO',
        selector: row => row.id_pedido,
        sortable: true,
        wrap: true
    },
    {
        name: 'NOMBRE',
        selector: row => row.nombre,
        sortable: true,
        wrap: true
    },
    {
        name: 'CANTIDAD',
        selector: row => row.cantidad,
        sortable: true,
        wrap: true
    },
    {
        name: 'TOTAL',
        selector: row => row.total,
        sortable: true,
        wrap: true
    }
];

const PedidosDelUsuario = (props) => {
    const idUser = props.idUser;
    const [detalles, setDetalles] = useState([])

    // # Recupero todos los pedidos del usuario
    const [pedidos, setPedidos] = useState([])
    const getPedidos = async () => {
        const URL = url_produccion+'/pedidos/' + idUser
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Token 
            }
        } 
        const response = await fetch(URL,requestOptions)
        const data = await response.json();
        if(data.length === 0)
            setPedidos([{'id':"No hay pedidos"}])
        else
            setPedidos(data)
    }

    useEffect(() => {
        getPedidos()
    }, [])

    // # Recupero todos los detalles del pedido
    const setPedidoEnTabla = async (id_pedido) => {
        const URL = url_produccion + '/detalle/' + id_pedido
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Token
            }
        }
        const response = await fetch(URL, requestOptions)
        const data = await response.json();
        setDetalles(data)
        localStorage.setItem("detalles", JSON.stringify(data))
    }

    return (
        <div>
            <div className="d-flex justify-content-center p-5">
                <Dropdown>
                    <Dropdown.Toggle danger="true" id="dropdown-basic">
                        Pedidos
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                            {pedidos.map((pedido, i) => (
                                pedido.id === "No hay pedidos" ? 
                                    <Dropdown.Item key={i}> {pedido.id} </Dropdown.Item> : 
                                    <Dropdown.Item key={i} onClick={() => setPedidoEnTabla(pedido.id)}> {pedido.id} </Dropdown.Item>))
                                }
                        </Dropdown.Menu>
                </Dropdown>
            </div>
            <div>
                <div className="producto-css">
                    <DataTable
                        title="Pedido"
                        columns={columnas}
                        data={detalles}
                        highlightOnHover
                        defaultSortFieldId={1} />
                </div>
            </div>
        </div>

    )
}

export default PedidosDelUsuario