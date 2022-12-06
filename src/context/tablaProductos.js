import React, { useContext, useState, useEffect } from "react"
import { CartContext } from './CartContext'
import DataTable, { createTheme } from "react-data-table-component";
import { Button } from "react-bootstrap";
import { Token, url_produccion } from "../variables.js";
import { useAuth0 } from "@auth0/auth0-react";

const Producto = () => {
  const { addItemToCart } = useContext(CartContext)
  const { isAuthenticated } = useAuth0()

  // # Funcion checkLog para los botones "agregar producto" 
  const checkLog = (product) => {
    if (isAuthenticated) {
      disminuirStock(product)
      addItemToCart(product)
    }
    else {
      //  TODO: hacer algo si no esta logueado y quiere agregar productos
    }
  }

  // # Columnas de la tabla
  const columnas = [
    {
      name: 'NOMBRE',
      selector: row => row.nombre_producto,
      sortable: true,
      wrap: true
    },
    {
      name: 'IMAGEN',
      cell: (product) => (
        <img src={`${product.imagen}`} width="70" height="70" alt={`${product.test}`}>
        </img>
      ), 
      sortable: true,
      wrap: true
    },
    {
      name: 'CATEGORIA',
      selector: row => row.categoria,
      sortable: true,
      wrap: true,
      hide: "md"
    },
    {
      name: 'PRECIO',
      selector: row => row.precio,
      sortable: true,
      wrap: true,
      hide: "md"

    },
    {
      name: 'STOCK',
      selector: row => row.stock,
      sortable: true,
      wrap: true,
      hide: "md"
    },
    {
      name: "Accion",
      cell: (product) => (
        <Button variant="danger" size="sm" onClick={() => checkLog(product)}>Agregar</Button>
      ),
      wrap: true,
      hide: "md"
    }
  ];

  // # Theme de la tabla
  createTheme('solarized', {
    text: {
      primary: '#660000',
      secondary: '#606060',
    },
    background: {
      default: '#E0E0E0',
    },
    context: {
      background: '#606060',
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

  //Hooks
  const [productos, setProductos] = useState([])
  const [pending, setPending] = useState(true);
  
  useEffect(() => { 
    showData() 
  }, [])

  const disminuirStock = (product) => {
    var productos_actualizados
    const producto_a_actualizar = productos.find(
      (producto) => producto.id === product.id
    );  
    if (producto_a_actualizar.stock === 1) { //Quiero eliminar directamente este producto de la tabla porque stock será = 0
      productos_actualizados = productos.filter((producto) => producto.id !== producto_a_actualizar.id)
    } else {
      productos_actualizados = productos.map((producto) => {          
        if (producto.id === product.id) {
          return { ...producto_a_actualizar, stock: (producto_a_actualizar.stock - 1) }
        }
        else return producto;
      })
    }

    setProductos(productos_actualizados)
    localStorage.setItem('productos',JSON.stringify(productos_actualizados))
  }

  //Function fetch para traer los datos
  const URL = url_produccion + '/productos'
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': Token },
  }
  
  const showData = async () => {
    const productosLocalmente = localStorage.getItem('productos')
    
    if(productosLocalmente !== null){
      setProductos(JSON.parse(productosLocalmente))
    }
    else{ // # Sino los obtengo del localstorage
      const response = await fetch(URL, requestOptions)
      const data = await response.json();
      localStorage.setItem('productos' , JSON.stringify(data))
      setProductos(JSON.parse(localStorage.getItem('productos')))
    }
    setPending(false)
  }

  

  return (
    
    <div className="producto-css">  
      <DataTable
        title="Productos"
        columns={columnas}
        data={productos}
        theme="solarized"
        pagination
        progressPending={pending}
        highlightOnHover
        responsive
        defaultSortFieldId={1}
      />
    </div>
  )
}

export default Producto