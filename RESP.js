import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function MenuLogin() {
  const [edificios, setEdificios] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [climaInfo, setClimaInfo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedAula, setSelectedAula] = useState('');
  const [isClimaOn, setIsClimaOn] = useState(false);
  const [showNoClimaAlert, setShowNoClimaAlert] = useState(false);

  useEffect(() => {
    // Obtener la lista de edificios
    axios.get('http://localhost:8000/edificios')
      .then(response => {
        setEdificios(response.data);
      })
      .catch(error => {
        console.error('Error fetching edificios:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedEdificio) {
      // Obtener la lista de aulas del edificio seleccionado
      axios.get(`http://localhost:8000/aulas/edificio/${selectedEdificio}`)
        .then(response => {
          setAulas(response.data);
        })
        .catch(error => {
          console.error('Error fetching aulas:', error);
        });
    } else {
      // Si no hay edificio seleccionado, resetear la lista de aulas
      setAulas([]);
      setSelectedAula('');
      setClimaInfo(null);
      setMarca(null);
    }
  }, [selectedEdificio]);

  useEffect(() => {
    if (selectedAula) {
      // Obtener el id del clima del aula seleccionada
      axios.get(`http://localhost:8000/ubicaciones_climas/aula/${selectedAula}`)
        .then(response => {
          const climaId = response.data[0]?.Id_clima;
          if (climaId) {
            // Obtener la información del clima
            axios.get(`http://localhost:8000/climas/${climaId}`)
              .then(response => {
                setClimaInfo(response.data);
  
                // Obtener Id_vinculacion_iot desde climaInfo
                const Id_vinculacion_iot = response.data.Id_vinculacion_iot;
  
                // Consultar la vinculación para obtener Id_placa_principal
                axios.get(`http://localhost:8000/vinculacion/${Id_vinculacion_iot}`)
                  .then(response => {
                    const Id_placa_principal = response.data.Id_placa_principal;
  
                    // Enviar el estado del clima a Id_placa_principal
                    const nuevoEstadoClima = isClimaOn ? 1 : 0;
                    axios.put(`http://localhost:8000/iot/${Id_placa_principal}`, { Estado_clima: nuevoEstadoClima })
                      .then(response => {
                        console.log('Estado del clima actualizado correctamente.');
                      })
                      .catch(error => {
                        console.error('Error al actualizar el estado del clima:', error);
                      });
                  })
                  .catch(error => {
                    console.error('Error fetching Id_placa_principal:', error);
                  });
              })
              .catch(error => {
                console.error('Error fetching clima info:', error);
                // Limpiar la información del clima en caso de error
                setClimaInfo(null);
              });
          } else {
            // Mostrar alerta si no hay clima asignado
            setShowNoClimaAlert(true);
            // Limpiar la información del clima
            setClimaInfo(null);
          }
        })
        .catch(error => {
          console.error('Error fetching clima id:', error);
          // Mostrar alerta en caso de error
          setShowNoClimaAlert(true);
          // Limpiar la información del clima
          setClimaInfo(null);
        });
    } else {
      // Si no hay aula seleccionada, resetear la información del clima
      setShowNoClimaAlert(false);
      setClimaInfo(null);
    }
  }, [selectedAula, isClimaOn]);  

  const handleClimaToggle = () => {
    setIsClimaOn(prevState => !prevState);
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1>Panel de inicio de usuario</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Selecciona un edificio</Form.Label>
            <Form.Control as="select" value={selectedEdificio} onChange={(e) => setSelectedEdificio(e.target.value)}>
              <option value="">Selecciona un edificio</option>
              {edificios.map(edificio => (
                <option key={edificio.Id_edificio} value={edificio.Id_edificio}>
                  {edificio.Nombre_edificio}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Selecciona un aula</Form.Label>
            <Form.Control as="select" value={selectedAula} onChange={(e) => setSelectedAula(e.target.value)} disabled={!selectedEdificio}>
              <option value="">Selecciona un aula</option>
              {aulas.map(aula => (
                <option key={aula.Id_aula} value={aula.Id_aula}>
                  {aula.Nombre_aula}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          {showNoClimaAlert && (
            <Alert variant="warning" onClose={() => setShowNoClimaAlert(false)} dismissible>
              Este salón no tiene un clima asignado.
            </Alert>
          )}
          {climaInfo && marca && (
            <div className="p-3 border rounded">
              <h5>Clima: {climaInfo.Modelo}</h5>
              <p>Marca: {marca.Nombre_marca}</p>
              <p>Fecha de Ingreso: {new Date(climaInfo.Fecha_ingreso).toLocaleDateString()}</p>
              <Button variant={isClimaOn ? 'danger' : 'success'} onClick={handleClimaToggle}>
                {isClimaOn ? 'Apagar' : 'Encender'}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
