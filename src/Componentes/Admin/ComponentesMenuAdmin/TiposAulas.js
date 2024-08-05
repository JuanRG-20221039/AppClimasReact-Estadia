import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css';

export default function TiposAulas() {
  const [tiposAulas, setTiposAulas] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTipoAula, setCurrentTipoAula] = useState({ Id_tipo_aula: '', Tipo: '' });
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [nuevoTipoNombre, setNuevoTipoNombre] = useState('');

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tipos-aula');
      setTiposAulas(response.data);
    } catch (error) {
      console.error('Error fetching tipos de aula:', error);
    }
  };

  const handleRegistrarTipoAula = () => {
    setNuevoTipoNombre('');
    setShowRegistroModal(true);
  };

  const handleCloseRegistroModal = () => {
    setShowRegistroModal(false);
  };

  const handleSaveNuevoTipoAula = async () => {
    try {
      // Convertir el nombre del nuevo tipo a mayúsculas
      const tipoEnMayusculas = nuevoTipoNombre.toUpperCase();
  
      let response;
      try {
        // Verificar si el tipo ya existe
        response = await axios.get(`http://localhost:8000/tipos-aula/nombre/${tipoEnMayusculas}`);
      } catch (error) {
        // Si hay un error, asegurarse de manejar solo los errores distintos a 404
        if (error.response && error.response.status === 404) {
          // Si el error es 404, significa que el tipo no existe, entonces proceder con el registro
          await axios.post('http://localhost:8000/tipos-aula', { Tipo: tipoEnMayusculas });
          alert('Tipo de aula registrado correctamente.');
          setShowRegistroModal(false);
          fetchData(); // Actualizar lista de tipos de aula
          return;
        } else {
          throw error; // Re-lanzar el error para manejarlo en el bloque catch exterior
        }
      }
  
      // Si el tipo ya existe
      if (response.status === 200) {
        alert('El tipo de aula ya existe.');
      }
  
    } catch (error) {
      console.error('Error registrando tipo de aula:', error);
      alert('Error al intentar registrar el tipo de aula. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const handleDelete = async (id) => {
    try {
      // En este caso, vamos a suponer que no hay verificación adicional para eliminar
      await axios.delete(`http://localhost:8000/tipos-aula/${id}`);
      setTiposAulas(tiposAulas.filter(tipo => tipo.Id_tipo_aula !== id));
    } catch (error) {
      console.error('Error deleting tipo de aula:', error);
      alert('No se puede elimnar el tipo de aula por que hay aulas asignadas con ese tipo');
    }
  };

  const handleEdit = (tipoAula) => {
    setCurrentTipoAula(tipoAula);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Convertir el nombre del tipo de aula a mayúsculas
      const tipoEnMayusculas = currentTipoAula.Tipo.toUpperCase();
  
      try {
        // Verificar si el tipo ya existe
        const response = await axios.get(`http://localhost:8000/tipos-aula/nombre/${tipoEnMayusculas}`);
        if (response.status === 200) {
          alert('El tipo de aula ya existe.');
          return;
        }
      } catch (error) {
        // Ignorar el error 404 si el tipo no existe, manejar otros errores
        if (error.response && error.response.status !== 404) {
          throw error; // Re-lanzar otros errores
        }
      }
  
      // Si no existe, proceder con la actualización
      await axios.put(`http://localhost:8000/tipos-aula/${currentTipoAula.Id_tipo_aula}`, {
        ...currentTipoAula,
        Tipo: tipoEnMayusculas
      });
      setTiposAulas(tiposAulas.map(tipo => (tipo.Id_tipo_aula === currentTipoAula.Id_tipo_aula ? { ...currentTipoAula, Tipo: tipoEnMayusculas } : tipo)));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating tipo de aula:', error);
      alert('Error al actualizar el tipo de aula. Por favor, inténtelo de nuevo más tarde.');
    }
  };
  

  return (
    <div>
      <div className='tituloComponente'>
        <h2>Registro de Tipos de Aulas</h2>
      </div>
      <Button variant="primary botonC" onClick={handleRegistrarTipoAula} style={{ marginBottom: '10px' }}>
        Registrar Tipo de Aula
      </Button>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposAulas.map(tipoAula => (
            <tr key={tipoAula.Id_tipo_aula}>
              <td>{tipoAula.Tipo}</td>
              <td>
                <Button variant="success botonS" onClick={() => handleEdit(tipoAula)}>Editar</Button>{' '}
                <Button variant="danger botonD" onClick={() => handleDelete(tipoAula.Id_tipo_aula)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para registrar nuevo tipo de aula */}
      <Modal show={showRegistroModal} onHide={handleCloseRegistroModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nuevo Tipo de Aula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNuevoTipoAula">
              <Form.Label>Nombre del Tipo de Aula</Form.Label>
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
          <Button variant="primary botonM botonMS" onClick={handleSaveNuevoTipoAula}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar tipo de aula */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tipo de Aula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreTipoAula">
              <Form.Label>Nombre del Tipo de Aula</Form.Label>
              <Form.Control
                type="text"
                value={currentTipoAula.Tipo}
                onChange={(e) => setCurrentTipoAula({ ...currentTipoAula, Tipo: e.target.value })}
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
