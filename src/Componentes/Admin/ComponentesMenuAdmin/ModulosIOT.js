import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css'

export default function ModulosIOT() {
  const [modulosIOT, setModulosIOT] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduloToDelete, setModuloToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentModulo, setCurrentModulo] = useState({ Id_iot: '', Mac_dispositivo: '' });
  const [macInput, setMacInput] = useState('');
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/iot');
      setModulosIOT(response.data);
    } catch (error) {
      console.error('Error fetching modulos IOT:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/vinculacion/modulo/${id}`);
      if (response.status === 200) {
        alert('No se puede eliminar el módulo porque está vinculado.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          await axios.delete(`http://localhost:8000/iot/${id}`);
          setModulosIOT(modulosIOT.filter(modulo => modulo.Id_iot !== id));
          alert('Módulo eliminado correctamente.');
        } catch (deleteError) {
          console.error('Error deleting modulo IOT:', deleteError);
          alert('Error al eliminar el módulo. Por favor, inténtelo de nuevo más tarde.');
        }
      } else {
        console.error('Error verifying vinculacion:', error);
        alert('Error al verificar la vinculación del módulo. Por favor, inténtelo de nuevo más tarde.');
      }
    }
  };

  const handleShowDeleteModal = (id) => {
    setModuloToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setModuloToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (moduloToDelete !== null) {
      handleDelete(moduloToDelete);
    }
    handleCloseDeleteModal();
  };

  const handleRegistrarModulo = () => {
    setShowCreateModal(true);
    setModalMode('create');
  };

  const handleEditarModulo = (modulo) => {
    setCurrentModulo(modulo);
    setMacInput(modulo.Mac_dispositivo);
    setShowEditModal(true);
    setModalMode('edit');
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setMacInput('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentModulo({ Id_iot: '', Mac_dispositivo: '' });
    setMacInput('');
  };

  const handleSaveModulo = async () => {
    const mac = macInput.trim();
    if (modalMode === 'create') {
      // Crear nuevo módulo
      try {
        const response = await axios.get(`http://localhost:8000/iot/mac/${mac}`);
        if (response.status === 200) {
          alert('La MAC ya está registrada.');
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            await axios.post('http://localhost:8000/iot', { Mac_dispositivo: mac });
            setShowCreateModal(false);
            setMacInput('');
            fetchData();
            alert('Módulo registrado correctamente.');
          } catch (createError) {
            console.error('Error creating modulo IOT:', createError);
            alert('Error al intentar registrar el módulo. Por favor, inténtelo de nuevo más tarde.');
          }
        } else {
          console.error('Error verifying MAC:', error);
          alert('Error al verificar la MAC. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    } else if (modalMode === 'edit') {
      // Editar módulo existente
      const id = currentModulo.Id_iot;
      try {
        const response = await axios.get(`http://localhost:8000/iot/mac/${mac}`);
        if (response.status === 200 && response.data.Id_iot !== id) {
          alert('La MAC ya está registrada.');
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            await axios.put(`http://localhost:8000/iot/${id}`, { Mac_dispositivo: mac });
            setShowEditModal(false);
            setCurrentModulo({ Id_iot: '', Mac_dispositivo: '' });
            setMacInput('');
            fetchData();
            alert('Módulo actualizado correctamente.');
          } catch (updateError) {
            console.error('Error updating modulo IOT:', updateError);
            alert('Error al intentar actualizar el módulo. Por favor, inténtelo de nuevo más tarde.');
          }
        } else {
          console.error('Error verifying MAC:', error);
          alert('Error al verificar la MAC. Por favor, inténtelo de nuevo más tarde.');
        }
      }
    }
  };

  return (
    <div>
      <div className='tituloComponente'>
        <h2>Registro de Módulos IOT</h2>
      </div>
      <Button variant="primary botonC" onClick={handleRegistrarModulo} style={{ marginBottom: '20px' }}>
        Registrar Nuevo Módulo de IoT
      </Button>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>MAC del Dispositivo</th>
            <th>Presencia de Personas</th>
            <th>Valor de Humedad</th>
            <th>Valor de Temperatura</th>
            <th>Estado del Clima</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modulosIOT.map(modulo => (
            <tr key={modulo.Id_iot}>
              <td>{modulo.Mac_dispositivo}</td>
              <td>{modulo.Presencia_personas}</td>
              <td>{modulo.Humedad_value}</td>
              <td>{modulo.Temperatura_value}</td>
              <td>{modulo.Estado_clima}</td>
              <td>
                <Button variant="success botonS" onClick={() => handleEditarModulo(modulo)}>Editar</Button>{' '}
                <Button variant="danger botonD" onClick={() => handleShowDeleteModal(modulo.Id_iot)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar este módulo de IoT?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMCC" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger botonM botonMC" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear nuevo módulo */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nuevo Módulo de IoT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMac">
              <Form.Label>MAC del Dispositivo</Form.Label>
              <Form.Control
                type="text"
                value={macInput}
                onChange={(e) => setMacInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleSaveModulo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar módulo */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Módulo de IoT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMacEditar">
              <Form.Label>MAC del Dispositivo</Form.Label>
              <Form.Control
                type="text"
                value={macInput}
                onChange={(e) => setMacInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleSaveModulo}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
