import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

const AdminPanel = () => {
  // Estado para el formulario de productos
  const [nombre, setProductoNombre] = useState('');
  const [precio, setProductoPrecio] = useState('');

  const handleProductoChange = (event) => setProductoNombre(event.target.value);
  const handlePrecioChange = (event) => setProductoPrecio(event.target.value);

  const handleSubmitProducto = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://restaurante-front-theta.vercel.app/v1/productos/agregarProducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, precio })
      });
      if (response.ok) {
        alert('Producto agregado exitosamente');
        setProductoNombre('');
        setProductoPrecio('');
      } else {
        const errorData = await response.json();
        alert(`Error al agregar producto: ${errorData.mensaje}`);
      }
    } catch (error) {
      console.error('Error al agregar PRODUCTO:', error);
      alert('Error al agregar producto. Por favor, intenta nuevamente.');
    }
  };

  // Estado para el formulario de usuarios
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);

  const handleSubmitUsuario = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/v1/user/agregarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      if (response.ok) {
        alert('Usuario agregado exitosamente');
        setUsername('');
        setPassword('');
        setRole('');
      } else {
        const errorData = await response.json();
        alert(`Error al agregar usuario: ${errorData.mensaje}`);
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      alert('Error al agregar usuario. Por favor, intenta nuevamente.');
    }
  };

  // Estado para la tabla de ventas
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const listarVentas = async () => {
      try {
        const response = await fetch('http://localhost:4000/v1/pedido/listarPedidos');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de ventas');
        }
        const ventasData = await response.json();
        setVentas(ventasData);
      } catch (error) {
        console.error('Error al listar las ventas:', error);
      }
    };

    listarVentas();
  }, []);

  return (
    <div className="container">
      <h2 className="mt-4 text-primary">Administrador</h2>

      {/* Formulario para agregar productos */}
      <div className="mt-4">
        <h3>Agregar Producto</h3>
        <form onSubmit={handleSubmitProducto}>
          <div className="mb-3">
            <label htmlFor="productoNombre" className="form-label">Nombre:</label>
            <input type="text" className="form-control" id="productoNombre" value={nombre} onChange={handleProductoChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="productoPrecio" className="form-label">Precio:</label>
            <input type="number" className="form-control" id="productoPrecio" value={precio} onChange={handlePrecioChange} />
          </div>
          <button type="submit" className="btn btn-primary">Guardar Producto</button>
        </form>
      </div>

      {/* Formulario para agregar usuarios */}
      <div className="mt-4">
        <h1>Agregar Usuario</h1>
        <form onSubmit={handleSubmitUsuario}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de Usuario:</label>
            <input type="text" className="form-control" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input type="password" className="form-control" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Rol:</label>
            <select className="form-select" id="role" value={role} onChange={handleRoleChange}>
              <option value="">Seleccionar Rol</option>
              <option value="admin">Administrador</option>
              <option value="mesero">Mesero</option>
              <option value="cocina">Cocina</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Agregar Usuario</button>
        </form>
      </div>

      {/* Lista de Ventas */}
      <div className="mt-4">
  <h2>Lista de Ventas</h2>
  <ul className="list-group">
    {ventas.map((venta,index) => (
      <li key={`${venta.id}-${index}`} className="list-group-item">
        <p>Mesa: {venta.mesa}</p>
        <p>Pedido:</p>
        <ul>
          {venta.pedido.map((item, index) => (
            <li key={index}>
              <p>Producto: {item.producto}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio Unitario: {item.precio}</p>
              <p>Precio Total: {item.cantidad * item.precio}</p> {/* Calcula el precio total */}
            </li>
          ))}
        </ul>
        <p>Precio Total de la Venta: {venta.pedido.reduce((total, item) => total + (item.cantidad * item.precio), 0)}</p>
      </li>
    ))}
  </ul>
</div>

      {/* Botón para regresar al login */}
      <div className="mt-4">
        <Link to="/" className="btn btn-danger">Volver al Login</Link>
      </div>
    </div>
  );
};

export default AdminPanel;