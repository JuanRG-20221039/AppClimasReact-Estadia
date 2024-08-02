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
  const [currentModulo, setCurrentModulo] = useState({ Id_iot: '', Mac_dispositivo: '', Alias_iot: '' });
  const [macInput, setMacInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [editField, setEditField] = useState(''); // 'mac' o 'alias'

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
  };

  const handleEditarModulo = (modulo) => {
    setCurrentModulo(modulo);
    setMacInput(modulo.Mac_dispositivo);
    setAliasInput(modulo.Alias_iot || '');
    setShowEditModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setMacInput('');
    setAliasInput('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentModulo({ Id_iot: '', Mac_dispositivo: '', Alias_iot: '' });
    setMacInput('');
    setAliasInput('');
    setEditField('');
  };

  const handleSaveModulo = async () => {
    const id = currentModulo.Id_iot;
  
    // Patrón para validar el formato de la MAC
    const macPattern = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    
    if (editField === 'mac') {
      const newMac = macInput.trim();
      
      // Validar formato de la MAC
      if (!macPattern.test(newMac)) {
        alert('Formato de MAC no válido. Use el formato XX:XX:XX:XX:XX:XX.');
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/iot/mac/${newMac}`);
        if (response.status === 200 && response.data.Id_iot !== id) {
          alert('La MAC ya está registrada.');
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Ignorar el error 404 y permitir la edición de la MAC
        } else {
          console.error('Error verifying MAC:', error);
          alert('Error al verificar la MAC. Por favor, inténtelo de nuevo más tarde.');
          return;
        }
      }
      try {
        await axios.put(`http://localhost:8000/iot/${id}`, { Mac_dispositivo: newMac });
        alert('MAC actualizada correctamente.');
        fetchData();
        handleCloseEditModal();
      } catch (updateError) {
        console.error('Error updating MAC:', updateError);
        alert('Error al intentar actualizar la MAC. Por favor, inténtelo de nuevo más tarde.');
      }
    } else if (editField === 'alias') {
      const newAlias = aliasInput.trim();
      try {
        await axios.put(`http://localhost:8000/iot/${id}`, { Alias_iot: newAlias });
        alert('Alias actualizado correctamente.');
        fetchData();
        handleCloseEditModal();
      } catch (updateError) {
        console.error('Error updating Alias:', updateError);
        alert('Error al intentar actualizar el Alias. Por favor, inténtelo de nuevo más tarde.');
      }
    }
  };

  const handleCreateModulo = async () => {
    // Patrón para validar el formato de la MAC
    const macPattern = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
  
    if (macInput.trim() === '' || aliasInput.trim() === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // Validar formato de la MAC
    if (!macPattern.test(macInput.trim())) {
      alert('Formato de MAC no válido. Use el formato XX:XX:XX:XX:XX:XX.');
      return;
    }
  
    const newMac = macInput.trim();
  
    try {
      const response = await axios.get(`http://localhost:8000/iot/mac/${newMac}`);
      if (response.status === 200) {
        alert('La MAC ya está registrada.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Ignorar el error 404 y permitir la creación del módulo
      } else {
        console.error('Error verifying MAC:', error);
        alert('Error al verificar la MAC. Por favor, inténtelo de nuevo más tarde.');
        return;
      }
    }
  
    const newModulo = {
      Mac_dispositivo: newMac,
      Alias_iot: aliasInput.trim(),
    };
  
    try {
      await axios.post('http://localhost:8000/iot', newModulo);
      alert('Módulo registrado correctamente.');
      fetchData();
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error registrando módulo IOT:', error);
      alert('Error al registrar el módulo. Por favor, inténtelo de nuevo más tarde.');
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
            <th>MAC</th>
            <th>Alias</th>
            <th>Presencia</th>
            <th>Humedad</th>
            <th>Temperatura</th>
            <th>Estado del Clima</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modulosIOT.map(modulo => (
            <tr key={modulo.Id_iot}>
              <td>{modulo.Mac_dispositivo}</td>
              <td>{modulo.Alias_iot}</td>
              <td>{modulo.Presencia_personas}</td>
              <td>{modulo.Humedad_value}</td>
              <td>{modulo.Temperatura_value}</td>
              <td>{modulo.Estado_clima}</td>
              <td>
                <Button variant="success botonS" onClick={() => {
                  setEditField('mac');
                  handleEditarModulo(modulo);
                }}>Editar MAC</Button>{' '}
                <Button variant="info botonS" onClick={() => {
                  setEditField('alias');
                  handleEditarModulo(modulo);
                }}>Editar Alias</Button>{' '}
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
            <Form.Group controlId="formAlias">
              <Form.Label>Alias del Dispositivo</Form.Label>
              <Form.Control
                type="text"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleCreateModulo}>
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
          {editField === 'mac' ? (
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
          ) : (
            <Form>
              <Form.Group controlId="formAliasEditar">
                <Form.Label>Alias del Dispositivo</Form.Label>
                <Form.Control
                  type="text"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
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
