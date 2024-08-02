import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css';

export default function TiposTrabajadores() {
  const [tiposTrabajadores, setTiposTrabajadores] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTipo, setCurrentTipo] = useState({ Id_tipo_de_trabajador: '', Tipo_trabajador: '' });
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [nuevoTipoNombre, setNuevoTipoNombre] = useState('');

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tiposTrabajadores');
      setTiposTrabajadores(response.data);
    } catch (error) {
      console.error('Error fetching tipos de trabajadores:', error);
    }
  };

  const handleRegistrarTipo = () => {
    setNuevoTipoNombre('');
    setShowRegistroModal(true);
  };

  const handleCloseRegistroModal = () => {
    setShowRegistroModal(false);
  };

  const handleSaveNuevoTipo = async () => {
    try {
      // Convertir el nombre del nuevo tipo a mayúsculas
      const tipoEnMayusculas = nuevoTipoNombre.toUpperCase();
  
      let response;
      try {
        // Verificar si el tipo ya existe
        response = await axios.get(`http://localhost:8000/tiposTrabajadores/tipo/${tipoEnMayusculas}`);
      } catch (error) {
        // Si hay un error, asegurarse de manejar solo los errores distintos a 404
        if (error.response && error.response.status === 404) {
          // Si el error es 404, significa que el tipo no existe, entonces proceder con el registro
          await axios.post('http://localhost:8000/tiposTrabajadores', { Tipo_trabajador: tipoEnMayusculas });
          alert('Tipo de trabajador registrado correctamente.');
          setShowRegistroModal(false);
          fetchData(); // Actualizar lista de tipos de trabajadores
          return;
        } else {
          throw error; // Re-lanzar el error para manejarlo en el bloque catch exterior
        }
      }
  
      // Si el tipo ya existe
      if (response.status === 200) {
        alert('El tipo de trabajador ya existe.');
      }
  
    } catch (error) {
      console.error('Error registrando tipo de trabajador:', error);
      alert('Error al intentar registrar el tipo de trabajador. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tiposTrabajadores/${id}`);
      setTiposTrabajadores(tiposTrabajadores.filter(tipo => tipo.Id_tipo_de_trabajador !== id));
    } catch (error) {
      console.error('Error deleting tipo de trabajador:', error);
      alert('Error al eliminar el tipo de trabajador. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const handleEdit = (tipo) => {
    setCurrentTipo(tipo);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Convertir el nombre del tipo a mayúsculas
      const tipoEnMayusculas = currentTipo.Tipo_trabajador.toUpperCase();
  
      try {
        // Verificar si el tipo ya existe
        const response = await axios.get(`http://localhost:8000/tiposTrabajadores/tipo/${tipoEnMayusculas}`);
        if (response.status === 200) {
          alert('El tipo de trabajador ya existe.');
          return;
        }
      } catch (error) {
        // Ignorar el error 404 si el tipo no existe, manejar otros errores
        if (error.response && error.response.status !== 404) {
          throw error; // Re-lanzar otros errores
        }
      }
  
      // Si no existe, proceder con la actualización
      await axios.put(`http://localhost:8000/tiposTrabajadores/${currentTipo.Id_tipo_de_trabajador}`, {
        ...currentTipo,
        Tipo_trabajador: tipoEnMayusculas
      });
      setTiposTrabajadores(tiposTrabajadores.map(tipo => (tipo.Id_tipo_de_trabajador === currentTipo.Id_tipo_de_trabajador ? { ...currentTipo, Tipo_trabajador: tipoEnMayusculas } : tipo)));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating tipo de trabajador:', error);
      alert('Error al actualizar el tipo de trabajador. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div>
      <div className='tituloComponente'>
        <h2>Registro de Tipos de Trabajadores</h2>
      </div>
      <Button variant="primary botonC" onClick={handleRegistrarTipo} style={{ marginBottom: '10px' }}>
        Registrar Tipo
      </Button>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposTrabajadores.map(tipo => (
            <tr key={tipo.Id_tipo_de_trabajador}>
              <td>{tipo.Tipo_trabajador}</td>
              <td>
                <Button variant="success botonS" onClick={() => handleEdit(tipo)}>Editar</Button>{' '}
                <Button variant="danger botonD" onClick={() => handleDelete(tipo.Id_tipo_de_trabajador)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para registrar nuevo tipo */}
      <Modal show={showRegistroModal} onHide={handleCloseRegistroModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nuevo Tipo de Trabajador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNuevoTipo">
              <Form.Label>Nombre del Tipo</Form.Label>
              <Form.Control
                type="text"
                value={nuevoTipoNombre}
                onChange={(e) => setNuevoTipoNombre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseRegistroModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleSaveNuevoTipo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar tipo */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tipo de Trabajador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreTipo">
              <Form.Label>Nombre del Tipo</Form.Label>
              <Form.Control
                type="text"
                value={currentTipo.Tipo_trabajador}
                onChange={(e) => setCurrentTipo({ ...currentTipo, Tipo_trabajador: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
