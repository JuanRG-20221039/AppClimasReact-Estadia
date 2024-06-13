import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

export default function ModulosIOT() {
  const [modulosIOT, setModulosIOT] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/iot');
        setModulosIOT(response.data);
      } catch (error) {
        console.error('Error fetching modulos IOT:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleRegistrarModulo = () => {
    // Aquí puedes agregar la lógica para abrir el formulario de registro de un nuevo módulo de IoT
    console.log('Registrando nuevo módulo de IoT...');
  };

  return (
    <div>
      <h2>Módulos IOT</h2>
      <Button variant="primary" onClick={handleRegistrarModulo} style={{ marginBottom: '20px' }}>
        Registrar Nuevo Módulo de IoT
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>MAC del Dispositivo</th>
            <th>Presencia de Personas</th>
            <th>Valor de Humedad</th>
            <th>Valor de Temperatura</th>
            <th>Estado del Clima</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modulosIOT.map(modulo => (
            <tr key={modulo.Id_iot}>
              <td>{modulo.Mac_dispositivo}</td>
              <td>{modulo.Presencia_personas}</td>
              <td>{modulo.Humedad_value}</td>
              <td>{modulo.Temperatura_value}</td>
              <td>{modulo.Estado_clima}</td>
              <td>
                <Button variant="success" onClick={() => console.log("Editar módulo IOT")}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => console.log("Eliminar módulo IOT")}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
