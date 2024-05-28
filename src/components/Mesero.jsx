import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Mesero({ user }) {
    const [productos, setProductos] = useState([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const ruta = 'https://restaurante-back-psi.vercel.app/v1/';
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [meseroSeleccionado, setMeseroSeleccionado] = useState('');
    const [meseros, setMeseros] = useState([]); // Inicializar meseros como un array vacío

    const navigate = useNavigate();

    if (user !== "mesero" || !user) {
        return <Navigate to="/" />;
    }

    const handleSelectMesa = event => {
        setMesaSeleccionada(event.target.value);
    };

    const listarProductos = async () => {
        try {
            const response = await fetch(`${ruta}productos/listarProductos`);
            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error al obtener productos: ${response.status} - ${errorDetails}`);
            }
            const data = await response.json();
            setProductos(data.producto);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const listarMeseros = async () => {
        try {
            const response = await fetch(`${ruta}user/listarMesero`);
            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error al obtener meseros: ${response.status} - ${errorDetails}`);
            }
            const data = await response.json();
            setMeseros(data.meseros);
        } catch (error) {
            console.error('Error al obtener meseros:', error);
            setMeseros([]); // Asegurar que meseros es un array vacío en caso de error
        }
    };

    const seleccionarProducto = event => {
        const idProducto = event.target.value;
        const producto = productos.find(producto => producto._id === idProducto);
        if (producto) {
            const productoConDetalles = {
                ...producto,
                cantidad: cantidad,
                mesa: mesaSeleccionada,
                mesero: meseroSeleccionado
            };
            setProductosSeleccionados([...productosSeleccionados, productoConDetalles]);
        }
    };

    const enviarPedido = () => {
        if (productosSeleccionados.length === 0 || !mesaSeleccionada || !meseroSeleccionado) {
            alert("Por favor selecciona productos, mesa y mesero antes de enviar el pedido.");
            return;
        }

        const datosPedido = {
            estado: "pendiente",
            mesa: mesaSeleccionada,
            mesero: meseroSeleccionado,
            pedido: productosSeleccionados.map(producto => ({
                producto: producto.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            }))
        };

        fetch(`${ruta}pedido/guardarPedido`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPedido)
        })
            .then(response => {
                if (response.ok) {
                    alert("Pedido enviado exitosamente.");
                    setProductosSeleccionados([]);
                    setMesaSeleccionada("");
                } else {
                    alert("Error al enviar el pedido.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al enviar el pedido.");
            });
    };

    const actualizarCantidad = (cantidad) => {
        if (cantidad >= 1) {
            setCantidad(cantidad);
        } else {
            alert("La cantidad debe ser un número positivo.");
        }
    };

    useEffect(() => {
        listarProductos();
        listarMeseros(); // Llamar a la función para listar meseros al cargar el componente
    }, []);

    return (
        <div className="bg-dark text-white p-3 mb-3">
            <h2>Menu</h2>
            <div className="container-sm" id="container">
                <select className="form-select" id="editMesa" value={mesaSeleccionada} onChange={handleSelectMesa}>
                    <option value="">Selecciona mesa</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            <br />
            <div className="container-sm" id="container">
                <select id="editMenu" onChange={seleccionarProducto} className="form-select" aria-label="Default select example">
                    <option value="0">Seleccione producto</option>
                    {Array.isArray(productos) && productos.map((producto, index) => (
                        <option key={index} value={producto._id}>{producto.nombre}</option>
                    ))}
                </select>
                <br />
                <select className="form-select" value={meseroSeleccionado} onChange={(e) => setMeseroSeleccionado(e.target.value)}>
                    <option value="">Selecciona mesero</option>
                    <option value="1">Oscar</option>
                    <option value="2">David</option>
                    <option value="3">Samuel</option>

                </select>
            </div>
            <p>Selecciona cantidad</p>
            <input
                type="number"
                className="entry"
                value={cantidad}
                onChange={(e) => actualizarCantidad(parseInt(e.target.value))}
                min="1"
                required
            />
            <br />
            <h3>Pedido:</h3>
            <ul id="listaPedido" className="list-group">
                {productosSeleccionados.map((product, index) => (
                    <li key={index} className="list-group-item">
                        <strong>{product.nombre}</strong> - producto: {product.nombre} - Cantidad: {product.cantidad} - Mesa: {product.mesa} - Precio: {product.precio} - mesero: {product.mesero}
                    </li>
                ))}
            </ul>
            <br />
            <button className="btn btn-primary" type="submit" onClick={enviarPedido}>Enviar Pedido</button>
            <br />
        </div>
    );
}

export default Mesero;
