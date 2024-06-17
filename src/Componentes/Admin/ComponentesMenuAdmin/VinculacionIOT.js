import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

export default function VinculacionIOT() {
  const [vinculaciones, setVinculaciones] = useState([]);
  const [placasDisponibles, setPlacasDisponibles] = useState([]);
  const [placaPrincipal, setPlacaPrincipal] = useState('');
  const [placaSecundaria, setPlacaSecundaria] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vinculacionToDelete, setVinculacionToDelete] = useState(null);

  useEffect(() => {
    const fetchPlacas = async () => {
      try {
        const responsePlacas = await axios.get('http://localhost:8000/iot');
        const responseVinculaciones = await axios.get('http://localhost:8000/vinculacion');
        
        const placasDisponibles = responsePlacas.data.filter(placa => {
          // Filtrar solo las placas que no están vinculadas como principal o secundaria
          return !responseVinculaciones.data.some(vinculacion => {
            return vinculacion.Id_placa_principal === placa.Id_iot || vinculacion.Id_Placa_secundaria === placa.Id_iot;
          });
        });

        setPlacasDisponibles(placasDisponibles);
        setVinculaciones(responseVinculaciones.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlacas();

    const intervalId = setInterval(fetchPlacas, 1000); // Actualiza cada segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleCrearVinculacion = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setPlacaPrincipal('');
    setPlacaSecundaria('');
  };

  const handleSubmitVinculacion = async () => {
    try {
      await axios.post('http://localhost:8000/vinculacion', {
        Id_placa_principal: parseInt(placaPrincipal),
        Id_Placa_secundaria: parseInt(placaSecundaria)
      });
      console.log('Vinculación creada correctamente.');
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating vinculacion:', error);
      alert('Error al crear la vinculación. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const handlePlacaPrincipalChange = (event) => {
    const selectedPlaca = event.target.value;
    setPlacaPrincipal(selectedPlaca);
    // Filtrar las placas disponibles para la secundaria excluyendo la placa principal seleccionada
    const filteredPlacas = placasDisponibles.filter(placa => placa.Id_iot !== parseInt(selectedPlaca));
    setPlacasDisponibles(filteredPlacas);
    setPlacaSecundaria(''); // Reiniciar la selección de la placa secundaria
  };

  const handlePlacaSecundariaChange = (event) => {
    const selectedPlaca = event.target.value;
    setPlacaSecundaria(selectedPlaca);
  };

  const handleShowDeleteModal = (id) => {
    setVinculacionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setVinculacionToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (vinculacionToDelete) {
      try {
        await axios.delete(`http://localhost:8000/vinculacion/${vinculacionToDelete}`);
        setVinculaciones(vinculaciones.filter(vinculacion => vinculacion.Id_vinculacion !== vinculacionToDelete));
        console.log('Vinculación eliminada correctamente.');
      } catch (error) {
        console.error('Error deleting vinculacion:', error);
        alert('Error al eliminar la vinculación. Por favor, inténtelo de nuevo más tarde.');
      }
    }
    handleCloseDeleteModal();
  };

  return (
    <div>
      <h2>Vinculaciones IOT</h2>
      <Button variant="success" onClick={handleCrearVinculacion} style={{ marginBottom: '20px' }}>
        Crear Vinculación
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID de Vinculación</th>
            <th>Placa Principal</th>
            <th>Placa Secundaria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vinculaciones.map(vinculacion => (
            <tr key={vinculacion.Id_vinculacion}>
              <td>{vinculacion.Id_vinculacion}</td>
              <td>{vinculacion.Id_placa_principal}</td>
              <td>{vinculacion.Id_Placa_secundaria}</td>
              <td>
                <Button variant="danger" onClick={() => handleShowDeleteModal(vinculacion.Id_vinculacion)}>
                  Eliminar Vinculación
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para eliminar vinculación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar esta vinculación?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear vinculación */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Vinculación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h6>La Placa "Principal" sera el modulo que tendra conexión directa con el aire acondicionado</h6>
        <hr/>
        <h6>La Placa "Secundaria" sera el modulo que estara ubicado en una zona distinta dentro de la misma área</h6>
        <hr/>
          <Form>
            <Form.Group controlId="selectPlacaPrincipal">
              <Form.Label>Placa Principal</Form.Label>
              <Form.Control
                as="select"
                value={placaPrincipal}
                onChange={handlePlacaPrincipalChange}
              >
                <option value="">Selecciona una placa</option>
                {placasDisponibles.map((placa) => (
                  <option key={placa.Id_iot} value={placa.Id_iot}>
                    {placa.Mac_dispositivo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="selectPlacaSecundaria">
              <Form.Label>Placa Secundaria</Form.Label>
              <Form.Control
                as="select"
                value={placaSecundaria}
                onChange={handlePlacaSecundariaChange}
                disabled={!placaPrincipal}
              >
                <option value="">Selecciona una placa</option>
                {placasDisponibles
                  .filter(
                    (placa) =>
                      placaPrincipal !== "" && placa.Id_iot !== parseInt(placaPrincipal)
                  )
                  .map((placa) => (
                    <option key={placa.Id_iot} value={placa.Id_iot}>
                      {placa.Mac_dispositivo}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitVinculacion}
            disabled={!placaPrincipal || !placaSecundaria}
          >
            Crear Vinculación
          </Button>
        </Modal.Footer>
      </Modal>;
    </div>
  );
}
