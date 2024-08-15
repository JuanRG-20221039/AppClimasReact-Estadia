import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

import '../../CSS/StyleGeneralAdmin.css';
import '../../CSS/MenuLoginUser.css';

export default function MenuLogin({ idClaveTrabajador }) {
  const [edificios, setEdificios] = useState([]);
  //const [aulas, setAulas] = useState([]);
  const [filteredAulas, setFilteredAulas] = useState([]);
  const [climaInfo, setClimaInfo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedAula, setSelectedAula] = useState('');
  const [isClimaOn, setIsClimaOn] = useState(false);
  const [showNoClimaAlert, setShowNoClimaAlert] = useState(false);
  const [showOutOfHoursAlert, setShowOutOfHoursAlert] = useState(false);
  const [idPlacaPrincipal, setIdPlacaPrincipal] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/edificios')
      .then(response => setEdificios(response.data))
      .catch(error => console.error('Error fetching edificios:', error));
  }, []);

  useEffect(() => {
    if (selectedEdificio) {
      axios.get(`http://localhost:8000/aulas/edificio/${selectedEdificio}`)
        .then(response => {
          // Obtener permisos del trabajador
          axios.get(`http://localhost:8000/permisos/trabajador/${idClaveTrabajador}`)
            .then(permisosResponse => {
              const climaIds = permisosResponse.data.map(permiso => permiso.Id_clima);
              
              // Filtrar aulas según los climas permitidos
              const fetchAulasPromises = climaIds.map(climaId => 
                axios.get(`http://localhost:8000/ubicaciones-climas/clima/${climaId}`)
              );

              Promise.all(fetchAulasPromises)
                .then(aulasResponses => {
                  const aulasPermitidas = new Set();
                  aulasResponses.forEach(response => {
                    const aulaId = response.data.Id_aula;
                    aulasPermitidas.add(aulaId);
                  });

                  const aulasFiltradas = response.data.filter(aula => aulasPermitidas.has(aula.Id_aula));
                  setFilteredAulas(aulasFiltradas);
                })
                .catch(error => console.error('Error fetching ubicaciones-climas:', error));
            })
            .catch(error => console.error('Error fetching permisos:', error));
        })
        .catch(error => console.error('Error fetching aulas:', error));
    } else {
      setFilteredAulas([]);
      setSelectedAula('');
      setClimaInfo(null);
      setMarca(null);
    }
  }, [selectedEdificio, idClaveTrabajador]);

  useEffect(() => {
    if (selectedAula) {
      axios.get(`http://localhost:8000/ubicaciones-climas/aula/${selectedAula}`)
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
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const horaAct = `H${currentHour}`;
    const diaAct = currentDay; // Convert to 1-based index

    axios.get(`http://localhost:8000/horas/buscar/${horaAct}`)
      .then(response => {
        const idHora = response.data.Id_horas;

        axios.get(`http://localhost:8000/horarios/${selectedAula}/${idHora}/${diaAct}`)
          .then(() => {
            // Horario válido, procede a encender o apagar el clima
            if (idPlacaPrincipal) {
              axios.put(`http://localhost:8000/iot/estado_clima/${idPlacaPrincipal}`, { Estado_clima: newState })
                .then(() => {
                  setIsClimaOn(!isClimaOn);
                  const accionRealizada = newState === 1 ? 'ENCENDIDO' : 'APAGADO';
                  const fechaHora = new Date().toISOString();
                  axios.post('http://localhost:8000/historial-acceso', {
                    Id_clave_trabajador: idClaveTrabajador,
                    Id_Clima: climaInfo?.Id_clima,
                    Accion_realizada: accionRealizada,
                    Fecha_Hora: fechaHora
                  })
                  .catch(error => console.error('Error saving historial de acceso:', error));
                })
                .catch(error => console.error('Error updating Estado_clima:', error));
            }
          })
          .catch(error => {
            // Error 404, el clima no está disponible en este horario y día
            setShowOutOfHoursAlert(true);
            console.error('El clima no está disponible en esta hora y día:', error);
          });
      })
      .catch(error => console.error('Error fetching hora info:', error));
  };

  return (
    <Container>
      <div className="fondoFixed"></div>
      <Row className="mb-3 margen">
        <Col>
          <div className='tituloComponente'>
            <h1>Panel de control de climas</h1>
          </div>
        </Col>
      </Row>
      <Row className="mb-3 cardFormB">
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
          <Form.Group className=''>
            <Form.Label>Selecciona un aula</Form.Label>
            <Form.Control as="select" value={selectedAula} onChange={(e) => setSelectedAula(e.target.value)} disabled={!selectedEdificio}>
              <option value="">Selecciona un aula</option>
              {filteredAulas.map(aula => (
                <option key={aula.Id_aula} value={aula.Id_aula}>
                  {aula.Nombre_aula}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          {showNoClimaAlert && (
            <Alert variant="warning" className='margenAlert' onClose={() => setShowNoClimaAlert(false)} dismissible>
              Este salón no tiene un clima asignado.
            </Alert>
          )}
          {showOutOfHoursAlert && (
            <Modal show={showOutOfHoursAlert} onHide={() => setShowOutOfHoursAlert(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Horario No Disponible</Modal.Title>
              </Modal.Header>
              <Modal.Body>El clima no está disponible en esta hora y día.</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowOutOfHoursAlert(false)}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          {climaInfo && marca && (
            <div className="p-3 border rounded cardClima">
              <h5>Clima: {climaInfo.Modelo}</h5>
              <p>Marca: {marca.Nombre_marca}</p>
              <p>Fecha de Ingreso: {new Date(climaInfo.Fecha_ingreso).toLocaleDateString()}</p>
              <Button variant={isClimaOn ? 'danger botonD' : 'success botonS'} onClick={handleClimaToggle}>
                {isClimaOn ? 'Apagar' : 'Encender'}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
