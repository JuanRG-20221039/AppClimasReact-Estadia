import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../CSS/MenuAdminCSS/Edificios.css';

export default function Edificios() {
  const [edificios, setEdificios] = useState([]);
  const [modalData, setModalData] = useState({
    Id_edificio: '',
    Nombre_edificio: '',
    Imagen: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEdificioData, setNewEdificioData] = useState({
    Nombre_edificio: '',
    Imagen: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/edificios');
        setEdificios(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleEdit = (id) => {
    const edificio = edificios.find(edificio => edificio.Id_edificio === id);
    setModalData({
      Id_edificio: edificio.Id_edificio,
      Nombre_edificio: edificio.Nombre_edificio,
      Imagen: edificio.Imagen
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/aulas/edificio/${id}`);
      const aulas = response.data;

      if (aulas.length > 0) {
        alert('No se puede eliminar el edificio porque tiene aulas asignadas.');
      } else {
        await axios.delete(`http://localhost:8000/edificios/${id}`);
        setEdificios(edificios.filter(edificio => edificio.Id_edificio !== id));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si no se encontraron aulas, se procede a eliminar el edificio
        try {
          await axios.delete(`http://localhost:8000/edificios/${id}`);
          setEdificios(edificios.filter(edificio => edificio.Id_edificio !== id));
        } catch (deleteError) {
          console.error('Error deleting edificio:', deleteError);
        }
      } else {
        console.error('Error fetching aulas:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewEdificioInputChange = (e) => {
    const { name, value } = e.target;
    setNewEdificioData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    const nombreMayusculas = modalData.Nombre_edificio.toUpperCase();

    try {
      const response = await axios.get(`http://localhost:8000/edificios/nombre/${nombreMayusculas}`);
      const edificio = response.data;

      if (edificio && edificio.Id_edificio !== modalData.Id_edificio) {
        alert('El edificio con ese nombre ya existe.');
      } else {
        await axios.put(`http://localhost:8000/edificios/${modalData.Id_edificio}`, {
          Nombre_edificio: nombreMayusculas,
          Imagen: modalData.Imagen
        });
        setShowEditModal(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si no se encontró el edificio, se procede a actualizar
        try {
          await axios.put(`http://localhost:8000/edificios/${modalData.Id_edificio}`, {
            Nombre_edificio: nombreMayusculas,
            Imagen: modalData.Imagen
          });
          setShowEditModal(false);
        } catch (updateError) {
          console.error('Error updating edificio:', updateError);
        }
      } else {
        console.error('Error checking edificio name:', error);
      }
    }
  };

  const handleCreateNewEdificio = async () => {
    const nombreMayusculas = newEdificioData.Nombre_edificio.toUpperCase();

    try {
      const response = await axios.get(`http://localhost:8000/edificios/nombre/${nombreMayusculas}`);
      const edificio = response.data;

      if (edificio) {
        alert('El edificio con ese nombre ya existe.');
      } else {
        await axios.post(`http://localhost:8000/edificios`, {
          Nombre_edificio: nombreMayusculas,
          Imagen: newEdificioData.Imagen
        });
        setShowCreateModal(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si no se encontró el edificio, se procede a crear uno nuevo
        try {
          await axios.post(`http://localhost:8000/edificios`, {
            Nombre_edificio: nombreMayusculas,
            Imagen: newEdificioData.Imagen
          });
          setShowCreateModal(false);
        } catch (createError) {
          console.error('Error creating edificio:', createError);
        }
      } else {
        console.error('Error checking edificio name:', error);
      }
    }
  };

  return (
    <div>
      <h2>Edificios</h2>
      <button className="btn btn-primary btnCrear" onClick={() => setShowCreateModal(true)}>Crear Nuevo Edificio</button>
      <table className="table">
        <thead>
          <tr>
            {/* <th className='id'>Numero</th> */}
            <th className='name'>Nombre</th>
            <th>Imagen</th>
            <th className='acciones'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {edificios.map(edificio => (
            <tr key={edificio.Id_edificio}>
              {/* <td>{edificio.Id_edificio}</td> */}
              <td>{edificio.Nombre_edificio}</td>
              <td>{edificio.Imagen}</td>
              <td>
                <button className="btn btn-success btn1" onClick={() => handleEdit(edificio.Id_edificio)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(edificio.Id_edificio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Edificio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreEdificio">
              <Form.Label>Nombre del Edificio</Form.Label>
              <Form.Control
                type="text"
                name="Nombre_edificio"
                value={modalData.Nombre_edificio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImagen">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="text"
                name="Imagen"
                value={modalData.Imagen}
                onChange={handleInputChange}
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

      {/* Modal de creación */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Edificio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNuevoNombreEdificio">
              <Form.Label>Nombre del Edificio</Form.Label>
              <Form.Control
                type="text"
                name="Nombre_edificio"
                value={newEdificioData.Nombre_edificio}
                onChange={handleNewEdificioInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formNuevaImagen">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="text"
                name="Imagen"
                value={newEdificioData.Imagen}
                onChange={handleNewEdificioInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateNewEdificio}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}