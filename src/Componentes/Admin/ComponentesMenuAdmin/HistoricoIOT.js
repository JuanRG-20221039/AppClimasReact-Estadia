import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../../CSS/StyleGeneralAdmin.css';

export default function HistoricoIOT() {
  const [historicoIOT, setHistoricoIOT] = useState([]);

  useEffect(() => {
    const fetchHistoricoIOT = async () => {
      try {
        // Obtener datos del histórico IOT
        const response = await axios.get('http://localhost:8000/historico-iot');
        setHistoricoIOT(response.data);
      } catch (error) {
        console.error('Error fetching historico IOT:', error);
      }
    };

    // Llama a la función fetchHistoricoIOT inmediatamente
    fetchHistoricoIOT();

    // Configura un intervalo para llamar a fetchHistoricoIOT cada segundo
    const intervalId = setInterval(fetchHistoricoIOT, 1000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <div className='tituloComponente'>
        <h2>Historial de modulos IoT</h2>
      </div>
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
  );
}
