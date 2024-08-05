import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js'; // Importa la biblioteca

import '../../../CSS/StyleGeneralAdmin.css';

export default function HistoricoIOT() {
  const [historicoIOT, setHistoricoIOT] = useState([]);

  useEffect(() => {
    const fetchHistoricoIOT = async () => {
      try {
        const response = await axios.get('http://localhost:8000/historico-iot');
        setHistoricoIOT(response.data);
      } catch (error) {
        console.error('Error fetching historico IOT:', error);
      }
    };

    fetchHistoricoIOT();
    const intervalId = setInterval(fetchHistoricoIOT, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const generatePDF = () => {
    const element = document.getElementById('historico-iot-table');
    const options = {
      margin: [10, 10, 10, 10], // Margen en [top, right, bottom, left]
      filename: 'HistoricoIOT.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, // Aumentar la escala para mayor claridad
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // Ajustar formato a A4
    };
    html2pdf().from(element).set(options).save();
  };  

  return (
    <div className="container">
      <div className='tituloComponente'>
        <h2>Historial de módulos IoT</h2>
      </div>
      <button onClick={generatePDF} className="btn btn-primary botonC">Descargar HistoricoIOT PDF</button>
      <div id="historico-iot-table">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No. de Registro</th>
              <th>No. Vinculación IOT</th>
              <th>Presencia Personas</th>
              <th>Humedad (%)</th>
              <th>Temperatura (°C)</th>
              <th>Estado Clima</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {historicoIOT.map(record => (
              <tr key={record.Id_historico_iot}>
                <td>{record.Id_historico_iot}</td>
                <td>{record.Id_vinculacion_iot}</td>
                <td>{record.Presencia_personas}</td>
                <td>{record.Humedad_value}</td>
                <td>{record.Temperatura_value}</td>
                <td>{record.Estado_clima ? 'Encendido' : 'Apagado'}</td>
                <td>{new Date(record.Fecha_hora).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
