import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cocina() {
    const [pedidos, setPedidos] = useState([]);
    
    const navigate = useNavigate();

    const handleVolver = () => {
        navigate('/Form'); // Asegúrate de que la ruta es correcta
    };

    useEffect(() => {
        fetch('https://restaurante-back-psi.vercel.app/v1/pedido/listarPedidos')
            .then(response => response.json())
            .then(data => setPedidos(data))
            .catch(error => console.error('Error al obtener los pedidos:', error));
    }, []);

    const handleCambiarEstado = (pedidoId) => {
        fetch(`https://restaurante-back-psi.vercel.app/v1/pedido/cambiarEstadoPedido/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'listo' })
        })
        .then(response => response.json())
        .then(data => {
            const updatedPedidos = pedidos.map(pedido => {
                if (pedido._id === pedidoId) {
                    return { ...pedido, estado: 'listo' };
                }
                return pedido;
            });
            setPedidos(updatedPedidos);
        })
        .catch(error => console.error('Error al cambiar el estado del pedido:', error));
    };

    return (
        <div className="bg-dark text-white p-3 mb-3">
            <h2>Lista de Pedidos en Cocina</h2>
            <ul className="list-group">
                {pedidos.map(pedido => (
                    <li key={pedido._id} className="list-group-item">
                        <h4>Pedido {pedido._id}</h4>
                        <p><strong>Mesa:</strong> {pedido.mesa}</p>
                        <p><strong>Mesero:</strong> {pedido.mesero}</p>
                        <p><strong>Estado:</strong> {pedido.estado}</p>
                        <h5>Productos:</h5>
                        <ul>
                            {pedido.pedido.map((producto, index) => (
                                <li key={index}>
                                    {producto.cantidad}x {producto.producto} - Precio: ${producto.precio}
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-success" onClick={() => handleCambiarEstado(pedido._id)}>Listo</button>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <button className="btn btn-danger" onClick={handleVolver}>Ir a Login</button>
            </div>
        </div>
    );
}

export default Cocina;
