import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import md5 from 'md5';  // Asegúrate de instalar 'md5' usando npm o yarn
import '../../CSS/Recuperar.css';
import axios from 'axios';

export default function Recuperar() {
  const [step, setStep] = useState(1);
  const [claveTrabajador, setClaveTrabajador] = useState('');
  const [correo, setCorreo] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [preguntaSecreta, setPreguntaSecreta] = useState('');
  const [idClaveTrabajador, setIdClaveTrabajador] = useState(null);

  const handleConsultar = async () => {
    try {
      const trabajadorPorClave = await axios.get(`http://localhost:8000/trabajadores/clave/${claveTrabajador}`);
      const trabajadorPorCorreo = await axios.get(`http://localhost:8000/trabajadores/correo/${correo}`);
      
      if (trabajadorPorClave.data.Id_clave_trabajador === trabajadorPorCorreo.data.Id_clave_trabajador) {
        setIdClaveTrabajador(trabajadorPorClave.data.Id_clave_trabajador);
        const respuestaSecretaData = await axios.get(`http://localhost:8000/respuestas/trabajador/${trabajadorPorClave.data.Id_clave_trabajador}`);
        const preguntaData = await axios.get(`http://localhost:8000/preguntas/${respuestaSecretaData.data[0].Id_pregunta}`);
        
        setPreguntaSecreta(preguntaData.data.Pregunta);
        setStep(2);
        setError('');
      } else {
        setError('La clave del trabajador o el correo electrónico no son válidos.');
      }
    } catch (error) {
      setError('Error al consultar la clave o el correo electrónico.');
    }
  };

  const handleEnviarRespuesta = async () => {
    try {
      const respuestaSecretaData = await axios.get(`http://localhost:8000/respuestas/trabajador/${idClaveTrabajador}`);
      const respuestaCorrecta = respuestaSecretaData.data[0].Respuesta.toLowerCase();
      
      if (respuestaSecreta.toLowerCase() === respuestaCorrecta) {
        setStep(3);
        setError('');
      } else {
        setError('La respuesta secreta es incorrecta.');
      }
    } catch (error) {
      setError('Error al verificar la respuesta secreta.');
    }
  };

  const handleEnviarNuevaContrasena = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (nuevaContrasena.length < 8 || nuevaContrasena.length > 12) {
      alert('La contraseña debe tener entre 8 y 12 caracteres.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/trabajadores/${idClaveTrabajador}`, {
        Contraseña: md5(nuevaContrasena),
      });
      setError('');
      alert('Contraseña cambiada exitosamente.');
      
      // Limpiar los formularios y regresar al paso 1
      setClaveTrabajador('');
      setCorreo('');
      setRespuestaSecreta('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setPreguntaSecreta('');
      setIdClaveTrabajador(null);
      setStep(1);
    } catch (error) {
      setError('Error al cambiar la contraseña.');
    }
  };

  return (
    <div className="registro-background">
      <div className='CardContainer'>

        <Card className="mb-4 cardSombreado cardTitulo">
          <Card.Body>
            <h2>Recuperación de Contraseña</h2>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {step >= 1 && (
          <Card className="mb-4 cardSombreado">
            <Card.Body>
              <Card.Title>Consultar Usuario</Card.Title>
              <Form>
                <Form.Group controlId="claveTrabajador">
                  <Form.Label>Clave del Trabajador</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su clave"
                    value={claveTrabajador}
                    onChange={(e) => setClaveTrabajador(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="correo">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese su correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" className="mt-3 buttonS" onClick={handleConsultar}>Consultar</Button>
              </Form>
            </Card.Body>
          </Card>
        )}

        {step >= 2 && (
          <Card className="mb-4 cardSombreado">
            <Card.Body>
              <Card.Title>Pregunta Secreta</Card.Title>
              <Form>
                <Form.Group controlId="preguntaSecreta">
                  <Form.Label>Pregunta:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pregunta secreta"
                    readOnly
                    value={preguntaSecreta}
                  />
                </Form.Group>

                <Form.Group controlId="respuestaSecreta">
                  <Form.Label>Respuesta</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su respuesta"
                    value={respuestaSecreta}
                    onChange={(e) => setRespuestaSecreta(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" className="mt-3 buttonS" onClick={handleEnviarRespuesta}>Enviar Respuesta</Button>
              </Form>
            </Card.Body>
          </Card>
        )}

        {step >= 3 && (
          <Card className='cardSombreado'>
            <Card.Body>
              <Card.Title>Cambiar Contraseña</Card.Title>
              <Form>
                <Form.Group controlId="nuevaContrasena">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese su nueva contraseña"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="confirmarContrasena">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme su nueva contraseña"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" className="mt-3 buttonS" onClick={handleEnviarNuevaContrasena}>Cambiar Contraseña</Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}
