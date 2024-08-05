import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css'

export default function Climas() {
  const [climas, setClimas] = useState([]);
  const [vinculacionesDisponibles, setVinculacionesDisponibles] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [showNoVinculacionesModal, setShowNoVinculacionesModal] = useState(false);
  const [showCrearClimaModal, setShowCrearClimaModal] = useState(false);
  const [showEditarClimaModal, setShowEditarClimaModal] = useState(false);
  const [selectedClima, setSelectedClima] = useState(null); // Estado para almacenar el clima seleccionado
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedVinculacion, setSelectedVinculacion] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [voltaje, setVoltaje] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [climaToDelete, setClimaToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const climasResponse = await axios.get('http://localhost:8000/climas');
        const climasData = await Promise.all(climasResponse.data.map(async clima => {
          const marcaResponse = await axios.get(`http://localhost:8000/marcas/${clima.Id_marca}`);
          return {
            ...clima,
            Nombre_marca: marcaResponse.data.Nombre_marca
          };
        }));
        setClimas(climasData);

        const vinculacionesResponse = await axios.get('http://localhost:8000/vinculacion');
        const vinculacionesAsignadas = climasResponse.data.map(clima => clima.Id_vinculacion_iot);
        const vinculacionesDisponibles = vinculacionesResponse.data.filter(vinculacion => !vinculacionesAsignadas.includes(vinculacion.Id_vinculacion_iot));
        setVinculacionesDisponibles(vinculacionesDisponibles);

        const marcasResponse = await axios.get('http://localhost:8000/marcas');
        setMarcas(marcasResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleShowCrearClimaModal = () => {
    if (vinculacionesDisponibles.length === 0) {
      setShowNoVinculacionesModal(true);
    } else {
      setShowCrearClimaModal(true);
    }
  };

  const handleCloseNoVinculacionesModal = () => setShowNoVinculacionesModal(false);

  const handleCloseCrearClimaModal = () => {
    setShowCrearClimaModal(false);
    setSelectedMarca('');
    setSelectedVinculacion('');
    setModelo('');
    setCapacidad('');
    setVoltaje('');
    setFechaIngreso('');
  };

  const handleCloseEditarClimaModal = () => {
    setShowEditarClimaModal(false);
    setSelectedMarca('');
    setSelectedVinculacion('');
    setModelo('');
    setCapacidad('');
    setVoltaje('');
    setFechaIngreso('');
    setSelectedClima(null);
  };

  const handleShowConfirmDeleteModal = (clima) => {
    setClimaToDelete(clima);
    setShowConfirmDeleteModal(true);
  };
  
  const handleCloseConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
    setClimaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (climaToDelete) {
      await handleDelete(climaToDelete.Id_clima);
      handleCloseConfirmDeleteModal();
    }
  };

  const handleRegistrarClima = async () => {
    try {
      const newClima = {
        Modelo: modelo,
        Id_marca: parseInt(selectedMarca),
        Capacidad: parseInt(capacidad),
        Voltaje: parseFloat(voltaje),
        Fecha_ingreso: fechaIngreso,
        Id_vinculacion_iot: parseInt(selectedVinculacion)
      };
  
      const response = await axios.post('http://localhost:8000/climas', newClima);
  
      if (response.status === 200) {
        console.log('Clima registrado exitosamente:', response.data);
        setClimas([...climas, response.data]);
        handleCloseCrearClimaModal(); // Cierra el modal después de registrar
      } else {
        console.error('Error al registrar clima - Respuesta inesperada:', response);
        handleCloseCrearClimaModal(); // Cierra el modal después de registrar
      }
    } catch (error) {
      console.error('Error registrando clima:', error);
      handleCloseCrearClimaModal(); // Cierra el modal después de registrar
    }
  };

  const handleEdit = (clima) => {
    setSelectedClima(clima);
    setSelectedMarca(clima.Id_marca.toString());
    setSelectedVinculacion(clima.Id_vinculacion_iot.toString());
    setModelo(clima.Modelo);
    setCapacidad(clima.Capacidad.toString());
    setVoltaje(clima.Voltaje.toString());
    setFechaIngreso(clima.Fecha_ingreso);
    setShowEditarClimaModal(true);
  };

  const handleUpdateClima = async () => {
    try {
      const updatedClima = {
        Id_clima: selectedClima.Id_clima,
        Modelo: modelo,
        Id_marca: parseInt(selectedMarca),
        Capacidad: parseInt(capacidad),
        Voltaje: parseFloat(voltaje),
        Fecha_ingreso: fechaIngreso,
        Id_vinculacion_iot: parseInt(selectedVinculacion)
      };

      const response = await axios.put(`http://localhost:8000/climas/${selectedClima.Id_clima}`, updatedClima);

      if (response.status === 200) {
        console.log('Clima actualizado exitosamente:', response.data);
        const updatedClimas = climas.map(clima => {
          if (clima.Id_clima === selectedClima.Id_clima) {
            return {
              ...clima,
              Modelo: response.data.Modelo,
              Id_marca: response.data.Id_marca,
              Capacidad: response.data.Capacidad,
              Voltaje: response.data.Voltaje,
              Fecha_ingreso: response.data.Fecha_ingreso,
              Id_vinculacion_iot: response.data.Id_vinculacion_iot
            };
          }
          return clima;
        });
        setClimas(updatedClimas);
        handleCloseEditarClimaModal(); // Cierra el modal después de actualizar
      } else {
        console.error('Error al actualizar clima - Respuesta inesperada:', response);
        handleCloseEditarClimaModal(); // Cierra el modal después de actualizar
      }
    } catch (error) {
      console.error('Error actualizando clima:', error);
      handleCloseEditarClimaModal(); // Cierra el modal después de actualizar
    }
  };

  const handleDelete = async (id) => {
    try {
      // Verifica si el clima está asignado en alguna ubicación
      try {
        const ubicacionesCheckResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${id}`);
        if (ubicacionesCheckResponse.status === 200) {
          alert('El clima está asignado en alguna ubicación, no se puede eliminar.');
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si no se encuentra la ubicación, continúa con la eliminación del clima
        } else {
          console.error('Error verificando ubicaciones del clima:', error);
          return;
        }
      }
    
      // Elimina los permisos relacionados con el clima
      try {
        const deletePermisosResponse = await axios.delete(`http://localhost:8000/permisos/deleteAll/clima/${id}`);
        if (deletePermisosResponse.status !== 200 && deletePermisosResponse.status !== 404) {
          console.error('Error al eliminar permisos:', deletePermisosResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Error al eliminar permisos:', error.response.data);
          return;
        }
      }
    
      // Elimina el historial de acceso relacionado con el clima
      try {
        const deleteHistorialResponse = await axios.delete(`http://localhost:8000/historial-acceso/deleteAll/clima/${id}`);
        if (deleteHistorialResponse.status !== 200 && deleteHistorialResponse.status !== 404) {
          console.error('Error al eliminar historial de acceso:', deleteHistorialResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Error al eliminar historial de acceso:', error.response.data);
          return;
        }
      }
    
      // Elimina el clima
      try {
        const deleteClimaResponse = await axios.delete(`http://localhost:8000/climas/${id}`);
        if (deleteClimaResponse.status === 200) {
          setClimas(climas.filter(clima => clima.Id_clima !== id));
        } else {
          console.error('Error al eliminar clima:', deleteClimaResponse.data);
        }
      } catch (error) {
        console.error('Error eliminando clima:', error);
      }
    } catch (error) {
      console.error('Error general en la operación:', error);
    }
  };  

  return (
    <div>
      <div className='tituloComponente'>
        <h2>Registro y Administración de Climas</h2>
      </div>
      <Button variant="primary botonC" onClick={handleShowCrearClimaModal}>Crear Nuevo Clima</Button>

      <hr/>
      <p>El numero de vinculacion sera el valor que se asignara a la hora de crear un Clima, esto para enlazarlo con los modulo de IoT correspondientes.</p>
      <hr/>

      <table className="table table-striped">
        <thead>
          <tr>
            {/* <th>No. Registro</th> */}
            <th>Modelo</th>
            <th>Marca</th>
            <th>Capacidad</th>
            <th>Voltaje</th>
            <th>Fecha de Ingreso</th>
            <th>Modulos Asignados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {climas.map(clima => (
            <tr key={clima.Id_clima}>
              {/* <td>{clima.Id_clima}</td> */}
              <td>{clima.Modelo}</td>
              <td>{clima.Nombre_marca}</td>
              <td>{clima.Capacidad}kg</td>
              <td>{clima.Voltaje}v</td>
              <td>{clima.Fecha_ingreso}</td>
              <td>Vinculación: {clima.Id_vinculacion_iot}</td>
              <td>
                <Button variant="success botonS" className="btn btn-success" onClick={() => handleEdit(clima)}>Editar</Button>
                <Button variant="danger botonD" onClick={() => handleShowConfirmDeleteModal(clima)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal si no hay vinculaciones disponibles */}
      <Modal show={showNoVinculacionesModal} onHide={handleCloseNoVinculacionesModal}>
        <Modal.Header closeButton>
          <Modal.Title>No hay Vinculaciones Disponibles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No hay vinculaciones disponibles para registrar un nuevo clima.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMCC" onClick={handleCloseNoVinculacionesModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear clima */}
      <Modal show={showCrearClimaModal} onHide={handleCloseCrearClimaModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Clima</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formModelo">
            <Form.Label>Modelo del Clima</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el modelo del clima" value={modelo} onChange={(e) => setModelo(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formMarca">
            <Form.Label>Seleccionar Marca</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedMarca(e.target.value)} value={selectedMarca}>
              <option value="">Seleccione una marca...</option>
              {marcas.map(marca => (
                <option key={marca.Id_marca} value={marca.Id_marca}>{marca.Nombre_marca}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formCapacidad">
            <Form.Label>Capacidad (kg)</Form.Label>
            <Form.Control type="number" placeholder="Ingrese la capacidad en kg" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formVoltaje">
            <Form.Label>Voltaje (v)</Form.Label>
            <Form.Control type="number" placeholder="Ingrese el voltaje" value={voltaje} onChange={(e) => setVoltaje(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formFechaIngreso">
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formVinculacion">
            <Form.Label>Seleccionar Vinculación</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedVinculacion(e.target.value)} value={selectedVinculacion}>
              <option value="">Seleccione una vinculación...</option>
              {vinculacionesDisponibles.map(vinculacion => (
                <option key={vinculacion.Id_vinculacion_iot} value={vinculacion.Id_vinculacion_iot}>
                  {`Vinculación ${vinculacion.Id_vinculacion_iot}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseCrearClimaModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleRegistrarClima} disabled={!modelo || !selectedMarca || !capacidad || !voltaje || !fechaIngreso || !selectedVinculacion}>
            Registrar Clima
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar clima */}
      <Modal show={showEditarClimaModal} onHide={handleCloseEditarClimaModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Clima</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formModeloEdit">
            <Form.Label>Modelo del Clima</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el modelo del clima" value={modelo} onChange={(e) => setModelo(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formMarcaEdit">
            <Form.Label>Seleccionar Marca</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedMarca(e.target.value)} value={selectedMarca}>
              <option value="">Seleccione una marca...</option>
              {marcas.map(marca => (
                <option key={marca.Id_marca} value={marca.Id_marca}>{marca.Nombre_marca}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formCapacidadEdit">
            <Form.Label>Capacidad (kg)</Form.Label>
            <Form.Control type="number" placeholder="Ingrese la capacidad en kg" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formVoltajeEdit">
            <Form.Label>Voltaje (v)</Form.Label>
            <Form.Control type="number" placeholder="Ingrese el voltaje" value={voltaje} onChange={(e) => setVoltaje(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formFechaIngresoEdit">
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formVinculacionEdit">
            <Form.Label>Seleccionar Vinculación</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedVinculacion(e.target.value)} value={selectedVinculacion}>
              <option value="">Seleccione una vinculación...</option>
              {vinculacionesDisponibles.map(vinculacion => (
                <option key={vinculacion.Id_vinculacion_iot} value={vinculacion.Id_vinculacion_iot}>
                  {`Vinculación ${vinculacion.Id_vinculacion_iot}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMC" onClick={handleCloseEditarClimaModal}>
            Cancelar
          </Button>
          <Button variant="primary botonM botonMS" onClick={handleUpdateClima} disabled={!modelo || !selectedMarca || !capacidad || !voltaje || !fechaIngreso || !selectedVinculacion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmDeleteModal} onHide={handleCloseConfirmDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas eliminar este clima? Esto también eliminará
            todos los permisos y el historial de acceso relacionados con este clima.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='botonM botonMCC' variant="secondary" onClick={handleCloseConfirmDeleteModal}>
            Cancelar
          </Button>
          <Button className='botonM botonMC' variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
