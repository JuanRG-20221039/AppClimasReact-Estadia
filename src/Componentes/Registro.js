import React, { useState } from 'react';

const Registro = () => {
  // Estados para los valores de los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes realizar la lógica para enviar los datos del formulario
    // por ejemplo, enviarlos a un servidor o manejarlos de otra manera
    console.log('Datos enviados:', { nombre, correo, contrasena, fotoPerfil });
    // Limpia los campos después del envío
    setNombre('');
    setCorreo('');
    setContrasena('');
    setRepetirContrasena('');
    setFotoPerfil(null);
  };

  return (
    <div className="container">
      <h2 className="mt-4">Registro</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo:</label>
          <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="contrasena" className="form-label">Contraseña:</label>
          <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="repetirContrasena" className="form-label">Repetir Contraseña:</label>
          <input type="password" className="form-control" id="repetirContrasena" value={repetirContrasena} onChange={(e) => setRepetirContrasena(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="fotoPerfil" className="form-label">Foto de Perfil:</label>
          <input type="file" className="form-control" id="fotoPerfil" onChange={(e) => setFotoPerfil(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
