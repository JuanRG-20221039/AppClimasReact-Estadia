import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import md5 from 'md5'; // Importar la biblioteca de MD5
import '../../CSS/Registro.css'

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  // Función para verificar si el correo ya está registrado
  const verificarCorreoRegistrado = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/trabajadores/correo/${correo}`);
      return response.status === 200; // true si el correo ya está registrado, false si no
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false; // El correo no está registrado
      } else {
        throw error; // Manejar otros errores
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 8 || contrasena.length > 12){
      alert('La contraseña tiene que contener de 8 a 12 caracteres.');
      return;
    }

    try {
      // Verificar si el correo ya está registrado
      const correoRegistrado = await verificarCorreoRegistrado();
      if (correoRegistrado) {
        alert('El correo electrónico ya está registrado. Por favor, utiliza otro correo.');
        return;
      }

      let claveGenerada = await generateUniqueKey(); // Obtener clave única válida

      // Encriptar la contraseña usando MD5
      const contrasenaEncriptada = md5(contrasena);

      const nuevoTrabajador = {
        Nombre_del_trabajador: nombre,
        Apellido_paterno: apellidoPaterno,
        Apellido_materno: apellidoMaterno,
        tipo_trabajador: 4, // Asignar por defecto el id 4
        Contraseña: contrasenaEncriptada, // Usar la contraseña encriptada
        Correo: correo,
        id_perfil: 2, // Asignar por defecto el id 2
        Clave_trabajador: claveGenerada
      };

      const registroResponse = await axios.post('http://localhost:8000/trabajadores', nuevoTrabajador);
      console.log('Respuesta del servidor:', registroResponse.data);

      // Limpia los campos después del envío exitoso
      setNombre('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setCorreo('');
      setContrasena('');
      setConfirmarContrasena('');
      alert('Registro exitoso');
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error al registrar trabajador:', error);
        alert('Hubo un error al registrar el trabajador. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Función para generar una clave aleatoria de 3 dígitos
  const generateRandomKey = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  // Función para obtener una clave única no existente en la base de datos
  const generateUniqueKey = async () => {
    let claveGenerada = generateRandomKey();
    try {
      let response = await axios.get(`http://localhost:8000/trabajadores/clave/${claveGenerada}`);
      while (response.status === 200) {
        claveGenerada = generateRandomKey();
        response = await axios.get(`http://localhost:8000/trabajadores/clave/${claveGenerada}`);
      }
      return claveGenerada;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return claveGenerada;
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="registro-background">
      <div className="container registro-content">
        <h2 className="mt-4">Registro</h2>
        <p>Ingrese los datos solicitados para completar correctamente su registro dentro del sistema de control de climas de la uthh.</p>
        <hr/>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <Row>
            <Col>
              <div className="mb-3">
                <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno:</label>
                <input type="text" className="form-control" id="apellidoPaterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} required />
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno:</label>
                <input type="text" className="form-control" id="apellidoMaterno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} required />
              </div>
            </Col>
          </Row>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
            <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>

          <Row>
            <Col>
              <div className="mb-3">
                <label htmlFor="contrasena" className="form-label">Contraseña:</label>
                <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña:</label>
                <input type="password" className="form-control" id="confirmarContrasena" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} required />
              </div>
            </Col>
          </Row>

          <button type="submit" className="btn btn-primary buttonS">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;