import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css'

export default function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [tiposAula, setTiposAula] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentAula, setCurrentAula] = useState({ Id_aula: '', Nombre_aula: '', Id_edificio: '', Id_tipo_aula: '' });
  const [newAula, setNewAula] = useState({ Nombre_aula: '', Id_edificio: '', Id_tipo_aula: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAulas = await axios.get('http://localhost:8000/aulas');
        setAulas(responseAulas.data);

        const responseEdificios = await axios.get('http://localhost:8000/edificios');
        setEdificios(responseEdificios.data);

        const responseTiposAula = await axios.get('http://localhost:8000/tipos-aula');
        setTiposAula(responseTiposAula.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleEdit = (aula) => {
    setCurrentAula(aula);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      // Consulta para verificar si hay reportes asociados al aula
      const reportesResponse = await axios.get(`http://localhost:8000/reportes/aula/${id}`);
      if (reportesResponse.data && reportesResponse.data.length > 0) {
        alert('No se puede eliminar el aula porque tiene reportes asociados.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error fetching reportes:', error);
        return;
      }
    }

    try {
      // Consulta para verificar si hay ubicaciones climáticas asociadas al aula
      const ubicacionesResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/aula/${id}`);
      if (ubicacionesResponse.data && ubicacionesResponse.data.length > 0) {
        alert('No se puede eliminar el aula porque tiene ubicaciones climáticas asociadas.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error fetching ubicaciones climáticas:', error);
        return;
      }
    }

    try {
      // Si no hay reportes ni ubicaciones climáticas asociadas, elimina el aula
      await axios.delete(`http://localhost:8000/aulas/${id}`);
      setAulas(aulas.filter(aula => aula.Id_aula !== id));
    } catch (deleteError) {
      if (deleteError.response && deleteError.response.status === 500) {
        alert('Error al eliminar el aula. Por favor, inténtelo de nuevo más tarde.');
      } else {
        console.error('Error deleting aula:', deleteError);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validar si el aula ya existe
      const response = await axios.get(`http://localhost:8000/aulas/nombre/${currentAula.Nombre_aula}/edificio/${currentAula.Id_edificio}/tipo/${currentAula.Id_tipo_aula}`);
      if (response.status === 200) {
        alert('El aula ya existe en el edificio seleccionado.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error fetching aula:', error);
        return;
      }
    }

    try {
      // Si el aula no existe, guardar los cambios
      await axios.put(`http://localhost:8000/aulas/${currentAula.Id_aula}`, currentAula);
      setAulas(aulas.map(aula => (aula.Id_aula === currentAula.Id_aula ? currentAula : aula)));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating aula:', error);
    }
  };

  const handleCreateAula = async () => {
    try {
      // Validar si el aula ya existe
      const response = await axios.get(`http://localhost:8000/aulas/nombre/${newAula.Nombre_aula}/edificio/${newAula.Id_edificio}`);
      if (response.status === 200) {
        alert('El aula ya existe en el edificio seleccionado.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error fetching aula:', error);
        return;
      }
    }

    try {
      // Crear el aula si no existe
      const responseCreate = await axios.post(`http://localhost:8000/aulas`, newAula);
      setAulas([...aulas, responseCreate.data]);
      setShowCreateModal(false);
      setNewAula({ Nombre_aula: '', Id_edificio: '', Id_tipo_aula: '' });
    } catch (error) {
      console.error('Error creating aula:', error);
    }
  };

  const getEdificioNombre = (idEdificio) => {
    const edificio = edificios.find(edificio => edificio.Id_edificio === idEdificio);
    return edificio ? edificio.Nombre_edificio : 'N/A';
  };

  const getTipoAulaNombre = (idTipoAula) => {
    const tipoAula = tiposAula.find(tipo => tipo.Id_tipo_aula === idTipoAula);
    return tipoAula ? tipoAula.Tipo : 'N/A';
  };

  return (
    <div>
      <div className='tituloComponente'>
        <h2>Panel de control para Aulas</h2>
      </div>
      <Button variant="primary botonC" onClick={() => setShowCreateModal(true)}>
        Crear Nueva Aula
      </Button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edificio</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aulas.map(aula => (
            <tr key={aula.Id_aula}>
              <td>{aula.Nombre_aula}</td>
              <td>{getEdificioNombre(aula.Id_edificio)}</td>
              <td>{getTipoAulaNombre(aula.Id_tipo_aula)}</td>
              <td>
                <button className="btn btn-success botonS" onClick={() => handleEdit(aula)}>Editar</button>
                <button className="btn btn-danger botonD" onClick={() => handleDelete(aula.Id_aula)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar aula */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Aula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreAula">
              <Form.Label>Nombre del Aula</Form.Label>
              <Form.Control
                type="text"
                value={currentAula.Nombre_aula}
                onChange={(e) => setCurrentAula({ ...currentAula, Nombre_aula: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formIdEdificio">
              <Form.Label>Edificio</Form.Label>
              <Form.Control
                as="select"
                value={currentAula.Id_edificio}
                onChange={(e) => setCurrentAula({ ...currentAula, Id_edificio: e.target.value })}
              >
                {edificios.map(edificio => (
                  <option key={edificio.Id_edificio} value={edificio.Id_edificio}>
                    {edificio.Nombre_edificio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formIdTipoAula">
              <Form.Label>Tipo de Aula</Form.Label>
              <Form.Control
                as="select"
                value={currentAula.Id_tipo_aula}
                onChange={(e) => setCurrentAula({ ...currentAula, Id_tipo_aula: e.target.value })}
              >
                {tiposAula.map(tipo => (
                  <option key={tipo.Id_tipo_aula} value={tipo.Id_tipo_aula}>
                    {tipo.Tipo}
                  </option>
                ))}
              </Form.Control>
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

      {/* Modal para crear aula */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Aula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreAula">
              <Form.Label>Nombre del Aula</Form.Label>
              <Form.Control
                type="text"
                value={newAula.Nombre_aula}
                onChange={(e) => setNewAula({ ...newAula, Nombre_aula: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formIdEdificio">
              <Form.Label>Edificio</Form.Label>
              <Form.Control
                as="select"
                value={newAula.Id_edificio}
                onChange={(e) => setNewAula({ ...newAula, Id_edificio: e.target.value })}
              >
                <option value="">Selecciona un edificio</option>
                {edificios.map(edificio => (
                  <option key={edificio.Id_edificio} value={edificio.Id_edificio}>
                    {edificio.Nombre_edificio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formIdTipoAula">
              <Form.Label>Tipo de Aula</Form.Label>
              <Form.Control
                as="select"
                value={newAula.Id_tipo_aula}
                onChange={(e) => setNewAula({ ...newAula, Id_tipo_aula: e.target.value })}
              >
                <option value="">Selecciona un tipo</option>
                {tiposAula.map(tipo => (
                  <option key={tipo.Id_tipo_aula} value={tipo.Id_tipo_aula}>
                    {tipo.Tipo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleCreateAula}>
            Crear Aula
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
