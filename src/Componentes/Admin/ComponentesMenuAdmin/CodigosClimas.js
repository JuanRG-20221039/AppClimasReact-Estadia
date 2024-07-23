import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css';

const CodigosClimaTable = () => {
    const [codigos, setCodigos] = useState([]);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false); // Estado para controlar el modal de eliminación
    const [codigoSeleccionado, setCodigoSeleccionado] = useState(null);
    const [nombreCodigo, setNombreCodigo] = useState('');
    const [codigoOn, setCodigoOn] = useState('');
    const [codigoOff, setCodigoOff] = useState('');

    useEffect(() => {
        const fetchCodigos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/codigosClima');
                setCodigos(response.data);
            } catch (error) {
                console.error('Error al cargar los códigos de clima:', error);
            }
        };

        fetchCodigos();
        const interval = setInterval(fetchCodigos, 1000);

        return () => clearInterval(interval);
    }, []);

    const abrirModalEditar = (codigo) => {
        setCodigoSeleccionado(codigo);
        setNombreCodigo(codigo.Nombre_codigo);
        setCodigoOn(codigo.Codigo_on);
        setCodigoOff(codigo.Codigo_off);
        setShowEditarModal(true);
    };

    const cerrarModalEditar = () => {
        setCodigoSeleccionado(null);
        setNombreCodigo('');
        setCodigoOn('');
        setCodigoOff('');
        setShowEditarModal(false);
    };

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/codigosClima/${id}`);
            const response = await axios.get('http://localhost:8000/codigosClima');
            setCodigos(response.data);
            setShowEliminarModal(false); // Cerrar modal de eliminación después de eliminar
        } catch (error) {
            console.error('Error al eliminar código:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            await axios.put(`http://localhost:8000/codigosClima/${codigoSeleccionado.Id_codigo}`, {
                Nombre_codigo: nombreCodigo,
                Codigo_on: codigoOn,
                Codigo_off: codigoOff
            });
            const response = await axios.get('http://localhost:8000/codigosClima');
            setCodigos(response.data);
            cerrarModalEditar();
        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    };

    const handleCrearCodigo = async () => {
        try {
            await axios.post('http://localhost:8000/codigosClima', {
                Nombre_codigo: nombreCodigo,
                Codigo_on: codigoOn,
                Codigo_off: codigoOff
            });
            const response = await axios.get('http://localhost:8000/codigosClima');
            setCodigos(response.data);
            setShowCrearModal(false);
            setNombreCodigo('');
            setCodigoOn('');
            setCodigoOff('');
        } catch (error) {
            console.error('Error al crear código:', error);
        }
    };

    const abrirModalEliminar = (codigo) => {
        setCodigoSeleccionado(codigo);
        setShowEliminarModal(true);
    };

    const cerrarModalEliminar = () => {
        setCodigoSeleccionado(null);
        setShowEliminarModal(false);
    };

    return (
        <div>
            <h2 className='tituloComponente'>Códigos para el control de Climas</h2>
            <Button variant="primary botonC" onClick={() => setShowCrearModal(true)}>Crear Nuevo Código</Button>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre del Código</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {codigos.map(codigo => (
                        <tr key={codigo.Id_codigo}>
                            <td>{codigo.Nombre_codigo}</td>
                            <td>
                                <Button variant="info botonS" onClick={() => abrirModalEditar(codigo)}>Editar</Button>
                                <Button variant="danger botonD" onClick={() => abrirModalEliminar(codigo)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para editar código */}
            <Modal show={showEditarModal} onHide={cerrarModalEditar} className="modalEditar">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Código</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombreCodigoEditar">
                            <Form.Label>Nombre del Código</Form.Label>
                            <Form.Control type="text" value={nombreCodigo} onChange={(e) => setNombreCodigo(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodigoOnEditar">
                            <Form.Label>Código de Encendido</Form.Label>
                            <Form.Control as="textarea" rows={3} value={codigoOn} onChange={(e) => setCodigoOn(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodigoOffEditar">
                            <Form.Label>Código de Apagado</Form.Label>
                            <Form.Control as="textarea" rows={3} value={codigoOff} onChange={(e) => setCodigoOff(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary botonM botonMCC" onClick={cerrarModalEditar}>
                        Cancelar
                    </Button>
                    <Button variant="primary botonM botonMC" onClick={handleGuardarCambios}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para crear código */}
            <Modal show={showCrearModal} onHide={() => setShowCrearModal(false)} className="modalCrear">
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Código</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombreCodigoCrear">
                            <Form.Label>Nombre del Código</Form.Label>
                            <Form.Control type="text" value={nombreCodigo} onChange={(e) => setNombreCodigo(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodigoOnCrear">
                            <Form.Label>Código de Encendido</Form.Label>
                            <Form.Control as="textarea" rows={3} value={codigoOn} onChange={(e) => setCodigoOn(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodigoOffCrear">
                            <Form.Label>Código de Apagado</Form.Label>
                            <Form.Control as="textarea" rows={3} value={codigoOff} onChange={(e) => setCodigoOff(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary botonM botonMCC" onClick={() => setShowCrearModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary botonM botonMC" onClick={handleCrearCodigo}>
                        Crear Código
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para confirmar eliminación */}
            <Modal show={showEliminarModal} onHide={cerrarModalEliminar} className="modalEliminar">
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Está seguro que desea eliminar este código?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary botonM botonMCC" onClick={cerrarModalEliminar}>
                        Cancelar
                    </Button>
                    <Button variant="danger botonM botonMC" onClick={() => handleEliminar(codigoSeleccionado.Id_codigo)}>
                        Confirmar Eliminación
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CodigosClimaTable;
