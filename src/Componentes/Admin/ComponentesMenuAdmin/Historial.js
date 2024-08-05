import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js'; // Importa la biblioteca

import '../../../CSS/StyleGeneralAdmin.css';

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:8000/historial-acceso');
        const historialData = await Promise.all(response.data.map(async (record) => {
          const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/${record.Id_clave_trabajador}`);
          const trabajador = trabajadorResponse.data;
          
          const ubicacionClimaResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${record.Id_Clima}`);
          const ubicacionClima = ubicacionClimaResponse.data;
          
          const aulaResponse = await axios.get(`http://localhost:8000/aulas/${ubicacionClima.Id_aula}`);
          const aula = aulaResponse.data;
          
          const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aula.Id_edificio}`);
          const edificio = edificioResponse.data;
          
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

    fetchHistorial();
    const intervalId = setInterval(fetchHistorial, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const generatePDF = () => {
    const element = document.getElementById('historial-table');
    const options = {
      margin: [10, 10, 10, 10], // Margen en [top, right, bottom, left]
      filename: 'HistorialAcceso.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, // Aumentar la escala para mayor claridad
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // Ajustar formato a A4
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="container">
      <div className='tituloComponente'>
        <h2>Historial de Acceso</h2>
      </div>
      <button onClick={generatePDF} className="btn btn-primary botonC">Descargar Historial PDF </button>
      <div id="historial-table">
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
    </div>
  );
}
