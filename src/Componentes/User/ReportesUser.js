import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../../CSS/StyleGeneralAdmin.css';
import '../../CSS/ReportesUser.css';
import '../../CSS/MenuLoginUser.css';

export default function ReportesUser({ idClaveTrabajador }) {
  const [formData, setFormData] = useState({
    edificio: '',
    aula: '',
    descripcion: '',
    tipoReporte: ''
  });
  const [edificios, setEdificios] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [tiposReporte, setTiposReporte] = useState([]);

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/edificios');
        setEdificios(response.data);
      } catch (error) {
        console.error('Error fetching edificios:', error);
      }
    };

    const fetchAulas = async () => {
      try {
        const response = await axios.get('http://localhost:8000/aulas');
        setAulas(response.data);
      } catch (error) {
        console.error('Error fetching aulas:', error);
      }
    };

    const fetchTiposReporte = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tiposReporte');
        setTiposReporte(response.data);
      } catch (error) {
        console.error('Error fetching tiposReporte:', error);
      }
    };

    fetchEdificios();
    fetchAulas();
    fetchTiposReporte();
  }, []);

  useEffect(() => {
    if (formData.edificio) {
      const aulasFiltradas = aulas.filter(aula => aula.Id_edificio === parseInt(formData.edificio));
      setAulasFiltradas(aulasFiltradas);
    } else {
      setAulasFiltradas([]);
    }
  }, [formData.edificio, aulas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString();

    const reporteData = {
      Id_aula: formData.aula,
      Id_Clave_trabajador: idClaveTrabajador,
      Fecha_solicitud: fechaActual,
      Fecha_finalizacion: null,
      Descripcion: formData.descripcion,
      Id_tipo_reporte: formData.tipoReporte
    };

    try {
      await axios.post('http://localhost:8000/reportesUsuario', reporteData);
      alert('Reporte enviado con éxito');

      // Limpia el formulario después de enviar
      setFormData({
        edificio: '',
        aula: '',
        descripcion: '',
        tipoReporte: ''
      });
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert('Error al enviar el reporte...');
    }
  };

  const handleCancel = () => {
    // Limpia el formulario al presionar el botón Cancelar
    setFormData({
      edificio: '',
      aula: '',
      descripcion: '',
      tipoReporte: ''
    });
  };

  return (
    <div className="container mt-4">
      <div className="fondoFixed"></div>
      <div className='tituloComponente'>
        <h2>Reportes</h2>
      </div>
      <p></p>
      <Form className='cardFormB' onSubmit={handleSubmit}>

        <Row>
          <Col>
            <Form.Group controlId="edificio">
              <Form.Label>Seleccionar Edificio</Form.Label>
              <Form.Control
                as="select"
                name="edificio"
                value={formData.edificio}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un edificio...</option>
                {edificios.map(edificio => (
                  <option key={edificio.Id_edificio} value={edificio.Id_edificio}>
                    {edificio.Nombre_edificio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="aula">
              <Form.Label>Seleccionar Aula</Form.Label>
              <Form.Control
                as="select"
                name="aula"
                value={formData.aula}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un aula...</option>
                {aulasFiltradas.map(aula => (
                  <option key={aula.Id_aula} value={aula.Id_aula}>
                    {aula.Nombre_aula}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="tipoReporte">
              <Form.Label>Tipo de Reporte</Form.Label>
              <Form.Control
                as="select"
                name="tipoReporte"
                value={formData.tipoReporte}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo de reporte...</option>
                {tiposReporte.map(tipo => (
                  <option key={tipo.Id_tipo_reporte} value={tipo.Id_tipo_reporte}>
                    {tipo.Tipo_reporte}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col className='botonesReport'>
            <Button variant="primary" type="submit" className="botonS botonR">Enviar</Button>
            <Button variant="secondary" type="button" className="botonD botonR" onClick={handleCancel}>Cancelar</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
