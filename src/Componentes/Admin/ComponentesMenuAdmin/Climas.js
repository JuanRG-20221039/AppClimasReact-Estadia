import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

export default function Climas() {
  const [climas, setClimas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/climas');
        setClimas(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000); // Actualiza cada 1 segundo
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/climas/${id}`);
      setClimas(climas.filter(clima => clima.Id_clima !== id));
    } catch (error) {
      console.error('Error deleting clima:', error);
    }
  };

  return (
    <div>
      <h2>Climas</h2>
      <Button variant="primary" onClick={() => console.log("Crear Clima")}>Crear Nuevo Clima</Button>
      <table className="table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Capacidad</th>
            <th>Voltaje</th>
            <th>Fecha de Ingreso</th>
            <th>Id vinculacion iot</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {climas.map(clima => (
            <tr key={clima.Id_clima}>
              <td>{clima.Modelo}</td>
              <td>{clima.Id_marca}</td>
              <td>{clima.Capacidad}</td>
              <td>{clima.Voltaje}</td>
              <td>{clima.Fecha_ingreso}</td>
              <td>{clima.Id_vinculacion_iot}</td>
              <td>
                <Button variant="success" className="btn btn-success" onClick={() => console.log("Editar Clima")}>Editar</Button>{' '}
                <Button variant="danger" className="btn btn-danger" onClick={() => handleDelete(clima.Id_clima)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
