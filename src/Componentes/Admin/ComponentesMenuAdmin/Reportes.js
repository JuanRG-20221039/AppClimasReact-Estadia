import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [tiposReporte, setTiposReporte] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reporteId, setReporteId] = useState(null); // Para almacenar el ID del reporte a liberar

  useEffect(() => {
    const fetchTiposReporte = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tiposReporte');
        setTiposReporte(response.data);
      } catch (error) {
        console.error('Error fetching tiposReporte:', error);
      }
    };

    const fetchReportes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reportesUsuario');
        const reportesData = await Promise.all(response.data.map(async (reporte) => {
          // Consultar los datos del trabajador por su ID de clave
          const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/${reporte.Id_Clave_trabajador}`);
          const trabajador = trabajadorResponse.data;
          // Obtener el tipo de reporte
          const tipoReporte = tiposReporte.find(tipo => tipo.Id_tipo_reporte === reporte.Id_tipo_reporte)?.Tipo_reporte || 'Desconocido';

          // Obtener los datos del aula y el edificio
          const aulaResponse = await axios.get(`http://localhost:8000/aulas/${reporte.Id_aula}`);
          const aula = aulaResponse.data;
          const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aula.Id_edificio}`);
          const edificio = edificioResponse.data;

          // Crear un nuevo objeto con los datos combinados
          return {
            ...reporte,
            Clave_trabajador: trabajador.Clave_trabajador,
            Nombre_del_trabajador: trabajador.Nombre_del_trabajador,
            Apellido_paterno: trabajador.Apellido_paterno,
            Apellido_materno: trabajador.Apellido_materno,
            Tipo_reporte: tipoReporte,
            Nombre_completo_aula: `${edificio.Nombre_edificio} - ${aula.Nombre_aula}`
          };
        }));

        // Filtrar los reportes donde Fecha_finalizacion es null
        const reportesFiltrados = reportesData.filter(reporte => reporte.Fecha_finalizacion === null);

        setReportes(reportesFiltrados);
      } catch (error) {
        console.error('Error fetching reportes:', error);
      }
    };

    // Fetch tiposReporte and reportes initially
    fetchTiposReporte().then(fetchReportes);

    const intervalId = setInterval(fetchReportes, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, [tiposReporte]);

  const mostrarModal = (idReporte) => {
    setReporteId(idReporte);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const liberarReporte = async () => {
    try {
      // Obtener la fecha actual del sistema
      const fechaActual = new Date().toISOString();

      // Actualizar el reporte con la fecha de finalización
      await axios.put(`http://localhost:8000/reportesUsuario/${reporteId}`, {
        Fecha_finalizacion: fechaActual
      });

      console.log(`Reporte con ID ${reporteId} liberado con fecha ${fechaActual}`);

      // Cierra el modal después de liberar el reporte
      setShowModal(false);
    } catch (error) {
      console.error('Error al liberar reporte:', error);
    }
  };

  return (
    <div className="container">
      <div className='tituloComponente'>
        <h2>Bandeja de Reportes</h2>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre del Aula</th>
            <th>Clave Trabajador</th>
            <th>Nombre del Trabajador</th>
            <th>Fecha Solicitud</th>
            <th>Descripción</th>
            <th>Tipo de Reporte</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.Id_reporte_usuario}>
              <td>{reporte.Nombre_completo_aula}</td>
              <td>{reporte.Clave_trabajador}</td>
              <td>{reporte.Nombre_del_trabajador} {reporte.Apellido_paterno}</td>
              <td>{reporte.Fecha_solicitud}</td>
              <td>{reporte.Descripcion}</td>
              <td>{reporte.Tipo_reporte}</td>
              <td>
                <button className="btn btn-primary botonS" onClick={() => mostrarModal(reporte.Id_reporte_usuario)}>Liberar reporte</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación para liberar reporte */}
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de liberación de reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que quieres liberar este reporte?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary botonM botonMCC" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="success botonM botonMS" onClick={liberarReporte}>
            Confirmar liberación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reportes;
