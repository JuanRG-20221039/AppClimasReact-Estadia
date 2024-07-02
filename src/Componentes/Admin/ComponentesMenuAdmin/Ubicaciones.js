import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

export default function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [climas, setClimas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [showCrearUbicacionModal, setShowCrearUbicacionModal] = useState(false);
  const [selectedClima, setSelectedClima] = useState('');
  const [selectedAula, setSelectedAula] = useState('');
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [ubicacionToDelete, setUbicacionToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesResponse, climasResponse, aulasResponse, edificiosResponse] = await Promise.all([
          axios.get('http://localhost:8000/ubicaciones-climas'),
          axios.get('http://localhost:8000/climas'),
          axios.get('http://localhost:8000/aulas'),
          axios.get('http://localhost:8000/edificios')
        ]);

        setUbicaciones(ubicacionesResponse.data);
        setClimas(climasResponse.data);
        setAulas(aulasResponse.data);
        setEdificios(edificiosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleShowCrearUbicacionModal = () => setShowCrearUbicacionModal(true);
  const handleCloseCrearUbicacionModal = () => setShowCrearUbicacionModal(false);
  const handleShowConfirmDeleteModal = (ubicacion) => {
    setUbicacionToDelete(ubicacion);
    setShowConfirmDeleteModal(true);
  };
  const handleCloseConfirmDeleteModal = () => setShowConfirmDeleteModal(false);

  const handleCrearUbicacion = async () => {
    try {
      const newUbicacion = {
        Id_clima: parseInt(selectedClima),
        Id_aula: parseInt(selectedAula)
      };

      const response = await axios.post('http://localhost:8000/ubicaciones-climas', newUbicacion);

      if (response.status === 200) {
        console.log('Ubicación registrada exitosamente:', response.data);
        setUbicaciones([...ubicaciones, response.data]);
        handleCloseCrearUbicacionModal(); // Cierra el modal después de registrar
      } else {
        console.error('Error al registrar ubicación - Respuesta inesperada:', response);
      }
    } catch (error) {
      console.error('Error registrando ubicación:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/ubicaciones-climas/${ubicacionToDelete.Id_ubicacion_Clima}`);
      if (response.status === 200) {
        setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.Id_ubicacion_Clima !== ubicacionToDelete.Id_ubicacion_Clima));
        handleCloseConfirmDeleteModal(); // Cierra el modal después de eliminar
      } else {
        console.error('Error al eliminar ubicación:', response.data);
      }
    } catch (error) {
      console.error('Error eliminando ubicación:', error);
    }
  };

  const getAulaNombre = (idAula) => {
    const aula = aulas.find(a => a.Id_aula === idAula);
    if (aula) {
      const edificio = edificios.find(e => e.Id_edificio === aula.Id_edificio);
      return `${edificio?.Nombre_edificio || ''} ${aula.Nombre_aula}`;
    }
    return '';
  };

  const getClimaModelo = (idClima) => {
    const clima = climas.find(c => c.Id_clima === idClima);
    return clima ? clima.Modelo : '';
  };

  const aulasSinClima = aulas.filter(aula => !ubicaciones.some(ubicacion => ubicacion.Id_aula === aula.Id_aula));
  const climasDisponibles = climas.filter(clima => !ubicaciones.some(ubicacion => ubicacion.Id_clima === clima.Id_clima));

  return (
    <div>
      <h2>Ubicaciones</h2>
      <Button variant="primary" onClick={handleShowCrearUbicacionModal}>Crear Ubicación</Button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID Ubicación Clima</th>
            <th>Modelo Clima</th>
            <th>Nombre Aula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map(ubicacion => (
            <tr key={ubicacion.Id_ubicacion_Clima}>
              <td>{ubicacion.Id_ubicacion_Clima}</td>
              <td>{getClimaModelo(ubicacion.Id_clima)}</td>
              <td>{getAulaNombre(ubicacion.Id_aula)}</td>
              <td>
                <Button variant="danger" onClick={() => handleShowConfirmDeleteModal(ubicacion)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear ubicación */}
      <Modal show={showCrearUbicacionModal} onHide={handleCloseCrearUbicacionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Ubicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formClima">
            <Form.Label>Seleccionar Clima</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedClima(e.target.value)} value={selectedClima}>
              <option value="">Seleccione un clima...</option>
              {climasDisponibles.map(clima => (
                <option key={clima.Id_clima} value={clima.Id_clima}>{clima.Modelo}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAula">
            <Form.Label>Seleccionar Aula</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedAula(e.target.value)} value={selectedAula}>
              <option value="">Seleccione un aula...</option>
              {aulasSinClima.map(aula => (
                <option key={aula.Id_aula} value={aula.Id_aula}>
                  {`${edificios.find(e => e.Id_edificio === aula.Id_edificio)?.Nombre_edificio || ''} ${aula.Nombre_aula}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCrearUbicacionModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearUbicacion} disabled={!selectedClima || !selectedAula}>
            Crear Ubicación
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showConfirmDeleteModal} onHide={handleCloseConfirmDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar esta ubicación?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
