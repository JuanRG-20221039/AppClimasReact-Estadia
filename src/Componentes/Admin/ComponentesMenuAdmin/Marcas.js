import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMarca, setCurrentMarca] = useState({ Id_marca: '', Nombre_marca: '' });
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [nuevaMarcaNombre, setNuevaMarcaNombre] = useState('');

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/marcas');
      setMarcas(response.data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  const handleRegistrarMarca = () => {
    setNuevaMarcaNombre('');
    setShowRegistroModal(true);
  };

  const handleCloseRegistroModal = () => {
    setShowRegistroModal(false);
  };

  const handleSaveNuevaMarca = async () => {
    try {
      // Convertir el nombre de la nueva marca a mayúsculas
      const nombreEnMayusculas = nuevaMarcaNombre.toUpperCase();
  
      let response;
      try {
        // Verificar si la marca ya existe
        response = await axios.get(`http://localhost:8000/marcas/nombre/${nombreEnMayusculas}`);
      } catch (error) {
        // Si hay un error, asegurarse de manejar solo los errores distintos a 404
        if (error.response && error.response.status === 404) {
          // Si el error es 404, significa que la marca no existe, entonces proceder con el registro
          await axios.post('http://localhost:8000/marcas', { Nombre_marca: nombreEnMayusculas });
          alert('Marca registrada correctamente.');
          setShowRegistroModal(false);
          fetchData(); // Actualizar lista de marcas
          return;
        } else {
          throw error; // Re-lanzar el error para manejarlo en el bloque catch exterior
        }
      }
  
      // Si la marca ya existe
      if (response.status === 200) {
        alert('La marca ya existe.');
      }
  
    } catch (error) {
      console.error('Error registrando marca:', error);
      alert('Error al intentar registrar la marca. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/climas/marca/${id}`);
      if (response.status === 200) {
        alert('No se puede eliminar la marca porque tiene climas asociados.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          await axios.delete(`http://localhost:8000/marcas/${id}`);
          setMarcas(marcas.filter(marca => marca.Id_marca !== id));
        } catch (deleteError) {
          console.error('Error deleting marca:', deleteError);
          alert('Error al eliminar la marca. Por favor, inténtelo de nuevo más tarde.');
        }
      } else {
        console.error('Error fetching climas:', error);
      }
    }
  };

  const handleEdit = (marca) => {
    setCurrentMarca(marca);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Convertir el nombre de la marca a mayúsculas
      const nombreEnMayusculas = currentMarca.Nombre_marca.toUpperCase();

      // Verificar si la marca ya existe
      const response = await axios.get(`http://localhost:8000/marcas/nombre/${nombreEnMayusculas}`);
      if (response.status === 200) {
        alert('La marca ya existe.');
        return;
      }

      // Si no existe, proceder con la actualización
      await axios.put(`http://localhost:8000/marcas/${currentMarca.Id_marca}`, {
        ...currentMarca,
        Nombre_marca: nombreEnMayusculas
      });
      setMarcas(marcas.map(marca => (marca.Id_marca === currentMarca.Id_marca ? { ...currentMarca, Nombre_marca: nombreEnMayusculas } : marca)));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating marca:', error);
      alert('Error al actualizar la marca. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div>
      <h2>Marcas</h2>
      <Button variant="primary" onClick={handleRegistrarMarca} style={{ marginBottom: '10px' }}>
        Registrar Marca
      </Button>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map(marca => (
            <tr key={marca.Id_marca}>
              <td>{marca.Nombre_marca}</td>
              <td>
                <Button variant="success" onClick={() => handleEdit(marca)}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(marca.Id_marca)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para registrar nueva marca */}
      <Modal show={showRegistroModal} onHide={handleCloseRegistroModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nueva Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNuevaMarca">
              <Form.Label>Nombre de la Marca</Form.Label>
              <Form.Control
                type="text"
                value={nuevaMarcaNombre}
                onChange={(e) => setNuevaMarcaNombre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRegistroModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveNuevaMarca}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar marca */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreMarca">
              <Form.Label>Nombre de la Marca</Form.Label>
              <Form.Control
                type="text"
                value={currentMarca.Nombre_marca}
                onChange={(e) => setCurrentMarca({ ...currentMarca, Nombre_marca: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
