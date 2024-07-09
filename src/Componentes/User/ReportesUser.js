import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import '../../CSS/StyleGeneralAdmin.css'

export default function ReportesUser() {
  const [formData, setFormData] = useState({
    edificio: '',
    aula: '',
    descripcion: '',
    tipoReporte: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del formulario a tu backend o realizar alguna acción
    console.log(formData);
    // Limpia el formulario después de enviar
    setFormData({
      edificio: '',
      aula: '',
      descripcion: '',
      tipoReporte: ''
    });
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
      <div className='tituloComponente'>
        <h2>Reportes</h2>
      </div>
      <p></p>
      <Form onSubmit={handleSubmit}>
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
            {/* Aquí podrías llenar las opciones dinámicamente */}
            <option value="Edificio A">Edificio A</option>
            <option value="Edificio B">Edificio B</option>
            <option value="Edificio C">Edificio C</option>
          </Form.Control>
        </Form.Group>

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
            {/* Aquí podrías llenar las opciones dinámicamente */}
            <option value="Aula 101">Aula 101</option>
            <option value="Aula 102">Aula 102</option>
            <option value="Aula 103">Aula 103</option>
          </Form.Control>
        </Form.Group>

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
            {/* Aquí podrías llenar las opciones dinámicamente */}
            <option value="Incidente">Incidente</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Otro">Otro</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mr-2">
          Enviar
        </Button>
        <Button variant="secondary" type="button" onClick={handleCancel}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
}
