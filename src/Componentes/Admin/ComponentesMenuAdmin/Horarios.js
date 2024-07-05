import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Horarios() {
  const [edificios, setEdificios] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [dias, setDias] = useState([]);
  const [horas, setHoras] = useState([]);
  const [selectedDia, setSelectedDia] = useState('');
  const [selectedHora, setSelectedHora] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);
  
  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/edificios');
        setEdificios(response.data);
      } catch (error) {
        console.error('Error fetching edificios:', error);
      }
    };

    fetchEdificios();
  }, []);

  const handleEdificioChange = async (e) => {
    const edificioId = e.target.value;
    setSelectedEdificio(edificioId);
    setSelectedAula('');
    setAulas([]);
    setHorarios([]);
    setDias([]);
    setHoras([]);
  
    try {
      const response = await axios.get(`http://localhost:8000/aulas/edificio/${edificioId}`);
      setAulas(response.data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
    }
  };

  const handleAulaChange = async (e) => {
    const aulaId = e.target.value;
    setSelectedAula(aulaId);
  
    try {
      const responseHorarios = await axios.get(`http://localhost:8000/horarios/aula/${aulaId}`);
      const responseHoras = await axios.get(`http://localhost:8000/horas`);
      const responseDias = await axios.get(`http://localhost:8000/dias`);
  
      // Ordenar los horarios antes de establecer el estado
      const sortedHorarios = responseHorarios.data.sort((a, b) => {
        if (a.Id_Dia !== b.Id_Dia) {
          return a.Id_Dia - b.Id_Dia;
        } else {
          return a.Id_Horas - b.Id_Horas;
        }
      });
  
      setHorarios(sortedHorarios);
      setHoras(responseHoras.data);
      setDias(responseDias.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHorarios([]); // No hay horarios disponibles, establecer como vacío
        const responseHoras = await axios.get(`http://localhost:8000/horas`);
        const responseDias = await axios.get(`http://localhost:8000/dias`);
        setHoras(responseHoras.data);
        setDias(responseDias.data);
      } else {
        console.error('Error fetching horarios, horas o dias:', error);
      }
    }
  };  

  const handleDiaChange = (e) => {
    const diaId = e.target.value;
    setSelectedDia(diaId);
    setSelectedHora('');
  };

  const handleHoraChange = (e) => {
    const horaId = e.target.value;
    setSelectedHora(horaId);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDia('');
    setSelectedHora('');
  };

  const handleEliminar = (idHorario) => {
    openConfirmModal(idHorario);
  };
  
  const confirmarEliminar = async () => {
    try {
      await axios.delete(`http://localhost:8000/horarios/${horarioToDelete}`);
      setHorarios(horarios.filter(horario => horario.Id_horario !== horarioToDelete));
      closeConfirmModal();
    } catch (error) {
      console.error('Error eliminando horario:', error);
    }
  };
  

  const openConfirmModal = (horarioId) => {
    setHorarioToDelete(horarioId);
    setShowConfirmModal(true);
  };
  
  const closeConfirmModal = () => {
    setHorarioToDelete(null);
    setShowConfirmModal(false);
  };

  const handleRegistrar = async () => {
    if (!selectedAula || !selectedDia || !selectedHora) {
      alert('Debe seleccionar un aula, un día y una hora');
      return;
    }
  
    const nuevoRegistro = {
      Id_aula: selectedAula,
      Id_Dia: selectedDia,
      Id_Horas: selectedHora
    };
  
    try {
      await axios.post('http://localhost:8000/horarios', nuevoRegistro);
      
      // Obtener los horarios actualizados después de registrar un nuevo horario
      const responseHorarios = await axios.get(`http://localhost:8000/horarios/aula/${selectedAula}`);
      
      // Ordenar los horarios antes de actualizar el estado
      const sortedHorarios = responseHorarios.data.sort((a, b) => {
        if (a.Id_Dia !== b.Id_Dia) {
          return a.Id_Dia - b.Id_Dia;
        } else {
          return a.Id_Horas - b.Id_Horas;
        }
      });

      setHorarios(sortedHorarios);
      
      closeModal();
    } catch (error) {
      console.error('Error registrando horario:', error);
    }
  };  

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{marginTop:-20}}>Selecciona un edificio y un aula:</h2>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="edificio" className="form-label">Edificio:</label>
          <select id="edificio" className="form-select mb-3" value={selectedEdificio} onChange={handleEdificioChange}>
            <option value="">Selecciona un edificio</option>
            {edificios.map(edificio => (
              <option key={edificio.Id_edificio} value={edificio.Id_edificio}>
                {edificio.Nombre_edificio}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="aula" className="form-label">Aula:</label>
          <select id="aula" className="form-select mb-3" value={selectedAula} onChange={handleAulaChange}>
            <option value="">Selecciona un aula</option>
            {aulas.map(aula => (
              <option key={aula.Id_aula} value={aula.Id_aula}>
                {aula.Nombre_aula}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        {selectedAula && (
          <button className="btn btn-primary" onClick={openModal}>Nuevo registro</button>
        )}
      </div>

      <div>
        <h3 className="mt-4">Horario asignado:</h3>
        {horarios.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Día</th>
                <th scope="col">Hora</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map(horario => {
                const dia = dias.find(d => d.Id_dias === horario.Id_Dia);
                const hora = horas.find(h => h.Id_horas === horario.Id_Horas);
                return (
                  <tr key={horario.Id_horario}>
                    <td>{dia ? dia.Dia : 'Día no encontrado'}</td>
                    <td>{hora ? `${hora.Hora_inicio} - ${hora.Hora_fin}` : 'Horario no encontrado'}</td>
                    <td>
                    <button className="btn btn-danger" onClick={() => handleEliminar(horario.Id_horario)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="mt-3">No hay horario asignado para esta aula.</p>
        )}
      </div>

      {/* Modal para nuevo registro */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDia">
              <Form.Label>Día:</Form.Label>
              <Form.Control as="select" value={selectedDia} onChange={handleDiaChange}>
                <option value="">Selecciona un día</option>
                {/* Ordenar los días por su ID antes de mostrarlos */}
                {dias.sort((a, b) => a.Id_dias - b.Id_dias).map(dia => (
                  <option key={dia.Id_dias} value={dia.Id_dias}>
                    {dia.Dia}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formHora">
              <Form.Label>Hora:</Form.Label>
              <Form.Control as="select" value={selectedHora} onChange={handleHoraChange} disabled={!selectedDia}>
                <option value="">Selecciona una hora</option>
                {/* Filtrar y mostrar solo las horas que no están registradas */}
                {horas
                  .filter(hora => {
                    if (!selectedDia) return false; // Si no hay día seleccionado, no mostrar ninguna hora
                    const horariosEnDia = horarios.filter(horario => horario.Id_Dia === parseInt(selectedDia));
                    return !horariosEnDia.some(horario => horario.Id_Horas === hora.Id_horas);
                  })
                  .map(hora => (
                    <option key={hora.Id_horas} value={hora.Id_horas}>
                      {`${hora.Hora_inicio} - ${hora.Hora_fin}`}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleRegistrar}>Registrar</Button>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para elimnar un registro */}
      <Modal show={showConfirmModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro que deseas eliminar este horario?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmarEliminar}>Eliminar</Button>
          <Button variant="secondary" onClick={closeConfirmModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
