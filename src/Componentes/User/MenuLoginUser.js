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
  const [idPlacaPrincipal, setIdPlacaPrincipal] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/edificios')
      .then(response => setEdificios(response.data))
      .catch(error => console.error('Error fetching edificios:', error));
  }, []);

  useEffect(() => {
    if (selectedEdificio) {
      axios.get(`http://localhost:8000/aulas/edificio/${selectedEdificio}`)
        .then(response => setAulas(response.data))
        .catch(error => console.error('Error fetching aulas:', error));
    } else {
      setAulas([]);
      setSelectedAula('');
      setClimaInfo(null);
      setMarca(null);
    }
  }, [selectedEdificio]);

  useEffect(() => {
    if (selectedAula) {
      axios.get(`http://localhost:8000/ubicaciones_climas/aula/${selectedAula}`)
        .then(response => {
          const climaId = response.data[0]?.Id_clima;
          if (climaId) {
            setShowNoClimaAlert(false);

            axios.get(`http://localhost:8000/climas/${climaId}`)
              .then(response => {
                setClimaInfo(response.data);
                const idVinculacionIot = response.data.Id_vinculacion_iot;

                axios.get(`http://localhost:8000/vinculacion/${idVinculacionIot}`)
                .then(response => {
                  const idPlacaPrincipal = response.data.Id_placa_principal;
                  setIdPlacaPrincipal(idPlacaPrincipal);
              
                  axios.get(`http://localhost:8000/iot/${idPlacaPrincipal}`)
                    .then(response => {
                      const estadoClima = response.data.Estado_clima;
                      setIsClimaOn(estadoClima === 1);
                    })
                    .catch(error => console.error('Error fetching Estado_clima:', error));
                })
                .catch(error => console.error('Error fetching Id_placa_principal:', error));              

                return response.data.Id_marca;
              })
              .then(marcaId => {
                axios.get(`http://localhost:8000/marcas/${marcaId}`)
                  .then(response => setMarca(response.data))
                  .catch(error => console.error('Error fetching marca info:', error));
              })
              .catch(error => {
                console.error('Error fetching clima info:', error);
                setClimaInfo(null);
                setMarca(null);
              });
          } else {
            setShowNoClimaAlert(true);
            setClimaInfo(null);
            setMarca(null);
          }
        })
        .catch(error => {
          console.error('Error fetching clima id:', error);
          setShowNoClimaAlert(true);
          setClimaInfo(null);
          setMarca(null);
        });
    } else {
      setShowNoClimaAlert(false);
      setClimaInfo(null);
      setMarca(null);
    }
  }, [selectedAula]);

  const handleClimaToggle = () => {
    const newState = isClimaOn ? 0 : 1;
  
    if (idPlacaPrincipal) {
      axios.put(`http://localhost:8000/iot/${idPlacaPrincipal}`, { Estado_clima: newState })
        .then(() => setIsClimaOn(!isClimaOn))
        .catch(error => console.error('Error updating Estado_clima:', error));
    }
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
