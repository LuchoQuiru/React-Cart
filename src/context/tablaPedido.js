import React , {useContext} from 'react'
import { CartContext } from './CartContext'
import DataTable, { createTheme } from "react-data-table-component";
import { Button  } from "react-bootstrap";
import { url_produccion } from '../variables.js';
import { useAuth0 } from '@auth0/auth0-react';

const Pedido = (props) => {
    const idUser = props.idUser;
    const {cartItems, deleteItemToCart, cleanCart } = useContext(CartContext) 
    const { getAccessTokenSilently } = useAuth0()

    const columnas = [
        {
          name: 'NOMBRE',
          selector: row => row.nombre_producto,
          sortable: true,
          wrap:true
        },
        {
          name: 'CATEGORIA',
          selector: row => row.categoria,
          sortable: true,
          wrap:true
        },
        {
          name: 'PRECIO',
          selector: row => row.precio,
          sortable: true,
          wrap:true,
          hide:"md"
          
        },
        {
          name: 'CANTIDAD',
          selector: row => row.amount,
          sortable: true,
          wrap:true,
          hide:"md"
        },
        {
          name: "Accion",
          cell: (product) => (
              <Button variant="danger" size="sm" onClick={() => deleteItemToCart(product)}>Eliminar</Button>
          ),
          wrap:true,
          hide:"md"
        }
    ];

    createTheme('solarized', {
    text: {
        primary: '#268bd2',
        secondary: '#2aa198',
    },
    background: {
        default: '#002b36',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#073642',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
    }, 'dark');      

    const nuevoPedido = async () => {
        const user_token = await getAccessTokenSilently()        
        const URL = url_produccion + '/pedidos'
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                        'Authorization' : 'Bearer ' + user_token},
            body: JSON.stringify({ total: 0 , id_usuario: idUser})
        }
        const response = await fetch(URL, requestOptions);
        const id_pedido = await response.json();
        return id_pedido
    }

    const nuevoDetalle = async(detalle) => {
        //Si hay una oferta vigente para el producto del detalle actual, la incluyo al detalle
        var URL = url_produccion + '/ofertas/' + detalle.id_producto
        var requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }            
        }
        var response = await fetch(URL, requestOptions);
        const data = await response.json()
        if(data.length > 0){
            const descuento = (data[0].descuento/100)
            detalle.total = detalle.total * (1-descuento)   
        }
        
        //Registro un nuevo detalle
        URL = url_produccion + '/detalle/'
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detalle)
        }
        response = await fetch(URL, requestOptions);
        //const data = await response.json();
    }

    const setTotalAlPedido = async(id_pedido,total) => {
        const user_token = await getAccessTokenSilently();
        const URL = url_produccion + '/pedidos/'+id_pedido
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','Authorization' : 'Bearer ' + user_token},
            body: JSON.stringify({ total : total , id_usuario : idUser})
        }

        await fetch(URL, requestOptions);
    }

    const descontarDeLosProductos = async(id_producto, cantidad) => {
        const user_token = await getAccessTokenSilently();
        const URL = url_produccion + '/productos/'+id_producto
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json','Authorization' : 'Bearer ' + user_token},
            body: JSON.stringify({ cantidad : cantidad})
        }

        await fetch(URL, requestOptions);
    }

    const confirmarPedido = async () => { 
        const detallesEnLocalStorage = localStorage.getItem("cartProducts")
        //Generar nuevo pedido p (sin el total)
        const id_nuevo_pedido = await nuevoPedido()
        //Generar iterativamente los detalles, asignandole el id del pedido p
        var total = 0
        JSON.parse(detallesEnLocalStorage).map(function(detalle){
            nuevoDetalle({id_pedido : id_nuevo_pedido , id_producto : parseInt(detalle.id) , cantidad : detalle.amount , total : detalle.precio * detalle.amount})
            descontarDeLosProductos(parseInt(detalle.id), parseInt(detalle.amount))
            total += detalle.precio * detalle.amount;
            return null
        })
        //Actualizar el total del pedido p con respecto a los detalles
        setTotalAlPedido(id_nuevo_pedido,total)
        cleanCart()
        
        localStorage.removeItem('productos')

    }

    return (
        <div>
            <div className="producto-css">
            <DataTable
                title="Productos seleccionados"
                columns={columnas}
                data={cartItems}
                responsive
                highlightOnHover
                defaultSortFieldId={1}/> 
                {   }
            <Button variant="danger" size="sm" onClick={() => confirmarPedido()}>Confirmar pedido</Button>
            </div>
        </div>
      )
}

export default Pedido

