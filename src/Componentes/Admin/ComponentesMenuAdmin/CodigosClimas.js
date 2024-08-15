import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

import '../../../CSS/StyleGeneralAdmin.css';

const CodigosClimaTable = () => {
    const [codigos, setCodigos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [codigoSeleccionado, setCodigoSeleccionado] = useState(null);
    const [idMarca, setIdMarca] = useState('');

    useEffect(() => {
        const fetchCodigos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/codigosClima');
                setCodigos(response.data);
            } catch (error) {
                console.error('Error al cargar los códigos de clima:', error);
            }
        };

        const fetchMarcas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/marcas');
                setMarcas(response.data);
            } catch (error) {
                console.error('Error al cargar las marcas:', error);
            }
        };

        fetchCodigos();
        fetchMarcas();
        const interval = setInterval(fetchCodigos, 1000);

        return () => clearInterval(interval);
    }, []);

    const generarClave = async () => {
        let claveGenerada;
        let claveDisponible = false;

        while (!claveDisponible) {
            claveGenerada = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
            try {
                const response = await axios.get(`http://localhost:8000/codigosClima/clave/${claveGenerada}`);
                if (response.status === 200) {
                    // Si la clave ya existe, generamos una nueva
                    continue;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Si el error es 404, la clave está disponible
                    claveDisponible = true;
                }
            }
        }
        return claveGenerada;
    };

    const abrirModalEditar = (codigo) => {
        setCodigoSeleccionado(codigo);
        setIdMarca(codigo.Id_marca);
        setShowEditarModal(true);
    };

    const cerrarModalEditar = () => {
        setCodigoSeleccionado(null);
        setIdMarca('');
        setShowEditarModal(false);
    };

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/codigosClima/${id}`);
            const response = await axios.get('http://localhost:8000/codigosClima');
            setCodigos(response.data);
            setShowEliminarModal(false);
        } catch (error) {
            console.error('Error al eliminar código:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            await axios.put(`http://localhost:8000/codigosClima/${codigoSeleccionado.Id_codigo}`, {
                Id_marca: idMarca,
                Clave: codigoSeleccionado.Clave // No se debe cambiar el campo Clave ya que es generado automáticamente
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
            // Validar si la marca ya tiene un código registrado
            try {
                const response = await axios.get(`http://localhost:8000/codigosClima/marca/${idMarca}`);
                if (response.status === 200) {
                    alert('Esta marca ya tiene un código registrado');
                    return;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Marca no tiene código registrado, continuar
                }
            }

            // Crear el código con una clave generada
            const clave = await generarClave();
            await axios.post('http://localhost:8000/codigosClima', {
                Id_marca: idMarca,
                Clave: clave
            });
            const response = await axios.get('http://localhost:8000/codigosClima');
            setCodigos(response.data);
            setShowCrearModal(false);
            setIdMarca('');
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

    const obtenerNombreMarca = (id) => {
        const marca = marcas.find(m => m.Id_marca === id);
        return marca ? marca.Nombre_marca : 'Desconocida';
    };

    return (
        <div>
            <h2 className='tituloComponente'>Códigos para el control de Climas</h2>
            <Button variant="primary botonC" onClick={() => setShowCrearModal(true)}>Crear Nuevo Código</Button>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Marca</th>
                        <th>Clave</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {codigos.map(codigo => (
                        <tr key={codigo.Id_codigo}>
                            <td>{obtenerNombreMarca(codigo.Id_marca)}</td>
                            <td>{codigo.Clave}</td>
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
                        <Form.Group controlId="formMarcaEditar">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control
                                as="select"
                                value={idMarca}
                                onChange={(e) => setIdMarca(e.target.value)}
                            >
                                <option value="">Selecciona una marca</option>
                                {marcas.map(marca => (
                                    <option key={marca.Id_marca} value={marca.Id_marca}>
                                        {marca.Nombre_marca}
                                    </option>
                                ))}
                            </Form.Control>
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
                        <Form.Group controlId="formMarcaCrear">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control
                                as="select"
                                value={idMarca}
                                onChange={(e) => setIdMarca(e.target.value)}
                            >
                                <option value="">Selecciona una marca</option>
                                {marcas.map(marca => (
                                    <option key={marca.Id_marca} value={marca.Id_marca}>
                                        {marca.Nombre_marca}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary botonM botonMCC" onClick={() => setShowCrearModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary botonM botonMS" onClick={handleCrearCodigo}>
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
