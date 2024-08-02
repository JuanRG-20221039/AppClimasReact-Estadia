import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../../CSS/StyleGeneralAdmin.css';

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        // Obtener historial
        const response = await axios.get('http://localhost:8000/historial-acceso');
        const historialData = await Promise.all(response.data.map(async (record) => {
          // Obtener datos del trabajador
          const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/${record.Id_clave_trabajador}`);
          const trabajador = trabajadorResponse.data;
          
          // Obtener datos de la ubicación del clima
          const ubicacionClimaResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${record.Id_Clima}`);
          const ubicacionClima = ubicacionClimaResponse.data;
          
          // Obtener datos del aula
          const aulaResponse = await axios.get(`http://localhost:8000/aulas/${ubicacionClima.Id_aula}`);
          const aula = aulaResponse.data;
          
          // Obtener datos del edificio
          const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aula.Id_edificio}`);
          const edificio = edificioResponse.data;
          
          // Crear un nuevo objeto con los datos combinados
          return {
            ...record,
            Clave_trabajador: trabajador.Clave_trabajador,
            Nombre_del_trabajador: trabajador.Nombre_del_trabajador,
            Apellido_paterno: trabajador.Apellido_paterno,
            Apellido_materno: trabajador.Apellido_materno,
            ClimaDescripcion: `Clima ${edificio.Nombre_edificio} ${aula.Nombre_aula}`
          };
        }));
        setHistorial(historialData);
      } catch (error) {
        console.error('Error fetching historial:', error);
      }
    };

    // Llama a la función fetchHistorial inmediatamente
    fetchHistorial();

    // Configura un intervalo para llamar a fetchHistorial cada segundo
    const intervalId = setInterval(fetchHistorial, 1000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <div className='tituloComponente'>
        <h2>Historial de Acceso</h2>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Clave Trabajador</th>
            <th>Nombre del Trabajador</th>
            <th>Clima y Aula</th>
            <th>Acción Realizada</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(record => (
            <tr key={record.Id_historial_acceso}>
              <td>{record.Clave_trabajador}</td>
              <td>{record.Nombre_del_trabajador}</td>
              <td>{record.ClimaDescripcion}</td>
              <td>{record.Accion_realizada}</td>
              <td>{new Date(record.Fecha_Hora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
