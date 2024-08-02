import React, { useState, useEffect } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import md5 from 'md5'; // Importar la biblioteca de MD5
import { useNavigate } from 'react-router-dom';

import '../../CSS/Registro.css'

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [confirmarRespuestaSecreta, setConfirmarRespuestaSecreta] = useState('');

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [trabajadorId, setTrabajadorId] = useState(null); // Estado para el ID del trabajador
  
  const navigate = useNavigate();

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

  // Función para obtener las preguntas secretas
  const obtenerPreguntas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/preguntas');
      setPreguntas(response.data);
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  };

  // Función para enviar la respuesta secreta
  const enviarRespuestaSecreta = async () => {
    try {
      const respuestaSecretaEnMinusculas = respuestaSecreta.toLowerCase();
      const nuevaRespuesta = {
        Id_clave_trabajador: trabajadorId,
        Id_pregunta: preguntaSeleccionada,
        Respuesta: respuestaSecretaEnMinusculas
      };

      console.log('Enviando datos:', nuevaRespuesta); // Para depuración

      const response = await axios.post('http://localhost:8000/respuestas', nuevaRespuesta);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al registrar la respuesta secreta:', error.response ? error.response.data : error.message);
      alert('Hubo un error al registrar la respuesta secreta. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log('Iniciando el registro del trabajador.');
  
    // Validaciones del formulario
    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }
  
    if (contrasena.length < 8 || contrasena.length > 12) {
      alert('La contraseña debe contener entre 8 y 12 caracteres.');
      return;
    }
  
    if (respuestaSecreta !== confirmarRespuestaSecreta) {
      alert('Las respuestas secretas no coinciden.');
      return;
    }
  
    try {
      console.log('Verificando si el correo ya está registrado.');
      // Verificar si el correo ya está registrado
      const correoRegistrado = await verificarCorreoRegistrado();
      console.log('Correo verificado:', correoRegistrado);
  
      if (correoRegistrado) {
        alert('El correo electrónico ya está registrado. Por favor, utiliza otro correo.');
        return;
      }
  
      console.log('Generando clave única para el trabajador.');
      // Generar clave única para el trabajador
      let claveGenerada = await generateUniqueKey();
      console.log('Clave generada:', claveGenerada);
  
      // Registrar al trabajador
      const nuevoTrabajador = {
        Nombre_del_trabajador: nombre,
        Apellido_paterno: apellidoPaterno,
        Apellido_materno: apellidoMaterno,
        tipo_trabajador: 4, // Asignar por defecto el id 4
        Contraseña: md5(contrasena), // Usar la contraseña encriptada
        Correo: correo,
        id_perfil: 2, // Asignar por defecto el id 2
        Clave_trabajador: claveGenerada
      };
  
      console.log('Registrando al trabajador:', nuevoTrabajador);
      const registroResponse = await axios.post('http://localhost:8000/trabajadores', nuevoTrabajador);
      console.log('Respuesta del registro del trabajador:', registroResponse.data);
  
      // Verificar que el trabajador fue registrado correctamente
      const trabajadorRegistrado = await axios.get(`http://localhost:8000/trabajadores/clave/${claveGenerada}`);
      console.log('Respuesta de la verificación del trabajador:', trabajadorRegistrado.data);
  
      if (!trabajadorRegistrado.data) {
        throw new Error('El trabajador no fue encontrado después del registro.');
      }
  
      // Guardar el ID del trabajador registrado para usarlo en el modal
      setTrabajadorId(trabajadorRegistrado.data.Id_clave_trabajador);
  
      // Mostrar el modal para la pregunta secreta
      setShowModal(true);
  
      // Limpiar los campos después del envío exitoso
      setNombre('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setCorreo('');
      setContrasena('');
      setConfirmarContrasena('');
    } catch (error) {
      console.error('Error al registrar trabajador o respuesta secreta:', error.response ? error.response.data : error.message);
      alert('Hubo un error al registrar el trabajador o la respuesta secreta. Por favor, inténtalo de nuevo.');
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

  // Cargar las preguntas secretas cuando se monta el componente
  useEffect(() => {
    obtenerPreguntas();
  }, []);

  // Función para manejar el envío de la respuesta secreta desde el modal
  const handleSubmitSecreta = async () => {
    if (respuestaSecreta !== confirmarRespuestaSecreta) {
      alert('Las respuestas secretas no coinciden.');
      return;
    }

    try {
      await enviarRespuestaSecreta();
      setShowModal(false); // Ocultar el modal después de enviar
      alert('Registro y respuesta secreta enviados exitosamente.');
      navigate('/');//redirecciona al inicio
    } catch (error) {
      console.error('Error al registrar la respuesta secreta desde el modal:', error.response ? error.response.data : error.message);
      alert('Hubo un error al registrar la respuesta secreta desde el modal. Por favor, inténtalo de nuevo.');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellidoPaterno('');
    setApellidoMaterno('');
    setCorreo('');
    setContrasena('');
    setConfirmarContrasena('');
    setPreguntaSeleccionada('');
    setRespuestaSecreta('');
    setConfirmarRespuestaSecreta('');
  };  

  return (
    <div className="registro-background">
      <div className="container registro-content">
        <h2 className="mt-4">Registro</h2>
        <p>Ingrese los datos solicitados para completar correctamente su registro dentro del sistema de control de climas de la uthh.</p>
        <hr />
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
                <div className="input-group">
                  <input 
                    type={mostrarContrasena ? "text" : "password"} 
                    className="form-control" 
                    id="contrasena" 
                    value={contrasena} 
                    onChange={(e) => setContrasena(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btnOcltar" 
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  >
                    {mostrarContrasena ? "⚫" : "⚪"}
                  </button>
                </div>
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña:</label>
                <div className="input-group">
                  <input 
                    type={mostrarConfirmarContrasena ? "text" : "password"} 
                    className="form-control" 
                    id="confirmarContrasena" 
                    value={confirmarContrasena} 
                    onChange={(e) => setConfirmarContrasena(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btnOcltar" 
                    onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                  >
                    {mostrarConfirmarContrasena ? "⚫" : "⚪"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <button type="submit" className="btn btn-primary buttonS">Registrar Trabajador</button>
              <button type="button" className="btn btn-secondary buttonC" onClick={limpiarFormulario}>Limpiar Formulario</button>
            </Col>
          </Row>

        </form>
      </div>

      {/* Modal para la respuesta secreta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Respuesta Secreta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¡Es necesario que complete este apartado ya que de lo contrario no podra recuperar su cuenta!</p>
          <div className="mb-3">
            <label htmlFor="preguntaSecreta" className="form-label">Pregunta Secreta:</label>
            <select className="form-select" id="preguntaSecreta" value={preguntaSeleccionada} onChange={(e) => setPreguntaSeleccionada(e.target.value)} required>
              <option value="">Selecciona una pregunta</option>
              {preguntas.map((pregunta) => (
                <option key={pregunta.Id_pregunta} value={pregunta.Id_pregunta}>{pregunta.Pregunta}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="respuestaSecreta" className="form-label">Respuesta Secreta:</label>
            <input type="text" className="form-control" id="respuestaSecreta" value={respuestaSecreta} onChange={(e) => setRespuestaSecreta(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmarRespuestaSecreta" className="form-label">Confirmar Respuesta Secreta:</label>
            <input type="text" className="form-control" id="confirmarRespuestaSecreta" value={confirmarRespuestaSecreta} onChange={(e) => setConfirmarRespuestaSecreta(e.target.value)} required />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button className='buttonS' variant="primary" onClick={handleSubmitSecreta}>
            Enviar Respuesta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registro;
