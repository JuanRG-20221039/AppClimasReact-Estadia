import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../../CSS/StyleGeneralAdmin.css'

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:8000/historial-acceso');
        const historialData = await Promise.all(response.data.map(async (record) => {
          // Consultar los datos del trabajador por su ID
          const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/${record.Id_clave_trabajador}`);
          const trabajador = trabajadorResponse.data;
          // Crear un nuevo objeto con los datos combinados
          return {
            ...record,
            Clave_trabajador: trabajador.Clave_trabajador,
            Nombre_del_trabajador: trabajador.Nombre_del_trabajador,
            Apellido_paterno: trabajador.Apellido_paterno,
            Apellido_materno: trabajador.Apellido_materno
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
            {/* <th>ID Historial</th> */}
            <th>Clave Trabajador</th>
            <th>Nombre del Trabajador</th>
            <th>Clima (No. Registro)</th>
            <th>Acción Realizada</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(record => (
            <tr key={record.Id_historial_acceso}>
              {/* <td>{record.Id_historial_acceso}</td> */}
              <td>{record.Clave_trabajador}</td>
              <td>{record.Nombre_del_trabajador}</td>
              <td>{record.Id_Clima}</td>
              <td>{record.Accion_realizada}</td>
              <td>{new Date(record.Fecha_Hora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
