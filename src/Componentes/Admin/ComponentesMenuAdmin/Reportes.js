import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reportesUsuario');
        const reportesData = await Promise.all(response.data.map(async (reporte) => {
          // Consultar los datos del trabajador por su ID de clave
          const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/${reporte.Id_Clave_trabajador}`);
          const trabajador = trabajadorResponse.data;
          // Crear un nuevo objeto con los datos combinados
          return {
            ...reporte,
            Clave_trabajador: trabajador.Clave_trabajador,
            Nombre_del_trabajador: trabajador.Nombre_del_trabajador,
            Apellido_paterno: trabajador.Apellido_paterno,
            Apellido_materno: trabajador.Apellido_materno
          };
        }));
        setReportes(reportesData);
      } catch (error) {
        console.error('Error fetching reportes:', error);
      }
    };

    // Fetch reportes initially
    fetchReportes();

    const intervalId = setInterval(fetchReportes, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const liberarReporte = (idReporte) => {
    // Aquí puedes implementar la lógica para liberar el reporte
    // Por ejemplo, podrías hacer una solicitud POST a una API para liberar el reporte
    console.log(`Liberando reporte con ID ${idReporte}`);
  };

  return (
    <div className="container mt-4">
      <h2>Reportes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id Aula</th>
            <th>Clave Trabajador</th>
            <th>Nombre del Trabajador</th>
            <th>Fecha Solicitud</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.Id_reporte_usuario}>
              <td>{reporte.Id_aula}</td>
              <td>{reporte.Clave_trabajador}</td>
              <td>{reporte.Nombre_del_trabajador} {reporte.Apellido_paterno}</td>
              <td>{reporte.Fecha_solicitud}</td>
              <td>{reporte.Descripcion}</td>
              <td>
                <button className="btn btn-primary" onClick={() => liberarReporte(reporte.Id_reporte_usuario)}>Liberar reporte</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reportes;
