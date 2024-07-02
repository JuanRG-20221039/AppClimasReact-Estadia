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
  const [macs, setMacs] = useState({});

  useEffect(() => {
    const fetchPlacas = async () => {
      try {
        const responsePlacas = await axios.get('http://localhost:8000/iot');
        const responseVinculaciones = await axios.get('http://localhost:8000/vinculacion');

        const placasDisponibles = responsePlacas.data.filter(placa => {
          return !responseVinculaciones.data.some(vinculacion => {
            return vinculacion.Id_placa_principal === placa.Id_iot || vinculacion.Id_Placa_secundaria === placa.Id_iot;
          });
        });

        setPlacasDisponibles(placasDisponibles);
        setVinculaciones(responseVinculaciones.data);

        const macPromises = responseVinculaciones.data.map(async (vinculacion) => {
          const macPrincipal = await axios.get(`http://localhost:8000/iot/mac_id/${vinculacion.Id_placa_principal}`);
          const macSecundaria = await axios.get(`http://localhost:8000/iot/mac_id/${vinculacion.Id_Placa_secundaria}`);
          return {
            Id_vinculacion_iot: vinculacion.Id_vinculacion_iot,
            Mac_principal: macPrincipal.data.Mac_dispositivo,
            Mac_secundaria: macSecundaria.data.Mac_dispositivo
          };
        });

        const macResults = await Promise.all(macPromises);
        const macsMap = macResults.reduce((acc, curr) => {
          acc[curr.Id_vinculacion_iot] = {
            Mac_principal: curr.Mac_principal,
            Mac_secundaria: curr.Mac_secundaria
          };
          return acc;
        }, {});
        
        setMacs(macsMap);
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
    const filteredPlacas = placasDisponibles.filter(placa => placa.Id_iot !== parseInt(selectedPlaca));
    setPlacasDisponibles(filteredPlacas);
    setPlacaSecundaria('');
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
        // Verificar si hay climas asociados a esta vinculación
        const responseClimas = await axios.get(`http://localhost:8000/climas/vinculacion/${vinculacionToDelete}`);
  
        // Si hay climas asociados, mostrar alerta y no eliminar
        if (responseClimas.status === 200) {
          alert('No se puede eliminar esta vinculación porque hay climas asociados.');
          return;
        }
      } catch (error) {
        // Si el error es 404, ignorarlo y proceder con la eliminación
        if (error.response && error.response.status === 404) {
          console.log('No hay climas asociados, procediendo con la eliminación.');
        } else {
          console.error('Error al verificar climas asociados:', error);
          alert('Ocurrió un error al verificar climas asociados. Inténtelo de nuevo más tarde.');
          return;
        }
      }
  
      // Si no hay climas asociados o se ignoró el error 404, proceder con la eliminación
      try {
        // Eliminar historial del IoT asociado a la vinculación
        await axios.delete(`http://localhost:8000/historico/eliminar/${vinculacionToDelete}`);
  
        // Eliminar la vinculación
        await axios.delete(`http://localhost:8000/vinculacion/${vinculacionToDelete}`);
        setVinculaciones(vinculaciones.filter(vinculacion => vinculacion.Id_vinculacion_iot !== vinculacionToDelete));
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
      <h2>Vinculacion de Modulos</h2>
      <Button variant="success" onClick={handleCrearVinculacion} style={{ marginBottom: '20px' }}>
        Crear Vinculación
      </Button>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Numero de Vinculación</th>
            <th>Modulo Principal (MAC)</th>
            <th>Modulo Secundario (MAC)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vinculaciones.map(vinculacion => (
            <tr key={vinculacion.Id_vinculacion_iot}>
              <td>{vinculacion.Id_vinculacion_iot}</td>
              <td>{macs[vinculacion.Id_vinculacion_iot]?.Mac_principal}</td>
              <td>{macs[vinculacion.Id_vinculacion_iot]?.Mac_secundaria}</td>
              <td>
                <Button variant="danger" onClick={() => handleShowDeleteModal(vinculacion.Id_vinculacion_iot)}>
                  Eliminar Vinculación
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar esta vinculación? <br></br>
          <hr/>
          Esta accion tambien eliminara todos los registros del historial...
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

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Vinculación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>La Placa "Principal" sera el modulo que tendra conexión directa con el aire acondicionado</h6>
          <hr />
          <h6>La Placa "Secundaria" sera el modulo que estara ubicado en una zona distinta dentro de la misma área</h6>
          <hr />
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
      </Modal>
    </div>
  );
}
