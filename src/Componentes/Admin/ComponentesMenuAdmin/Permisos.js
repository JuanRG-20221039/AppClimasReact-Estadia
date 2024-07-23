import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table, Modal } from 'react-bootstrap';

const UpdateWorkerRole = () => {
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  // Fetch workers, roles, and buildings data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workersResponse = await axios.get('http://localhost:8000/trabajadores');
        const rolesResponse = await axios.get('http://localhost:8000/tiposTrabajadores');
        const buildingsResponse = await axios.get('http://localhost:8000/edificios');
        setWorkers(workersResponse.data);
        setRoles(rolesResponse.data);
        setBuildings(buildingsResponse.data);

      // Agregar log para verificar los datos de edificios
      console.log('Buildings fetched:', buildingsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle worker selection change
  const handleWorkerChange = async (e) => {
    const selectedWorkerId = e.target.value;
    const worker = workers.find(worker => worker.Id_clave_trabajador === parseInt(selectedWorkerId));
    setSelectedWorker(selectedWorkerId);
    setSelectedRole(worker ? worker.tipo_trabajador : '');

    // Fetch permissions for the selected worker
    try {
      const permissionsResponse = await axios.get(`http://localhost:8000/permisos/trabajador/${selectedWorkerId}`);
      const permissionsData = await Promise.all(permissionsResponse.data.map(async (perm) => {
        const climaResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${perm.Id_clima}`);
        const aulaResponse = await axios.get(`http://localhost:8000/aulas/${climaResponse.data.Id_aula}`);
        const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aulaResponse.data.Id_edificio}`);

        return {
          ...perm,
          clima: climaResponse.data,
          aula: aulaResponse.data,
          edificio: edificioResponse.data,
        };
      }));

      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleBuildingChange = async (e) => {
    const selectedBuildingId = parseInt(e.target.value, 10);  // Asegúrate de convertir a número
    setSelectedBuilding(selectedBuildingId);
  
    console.log('Selected Building ID:', selectedBuildingId);
  
    try {
      const classroomsResponse = await axios.get(`http://localhost:8000/aulas/edificio/${selectedBuildingId}`);
      setClassrooms(classroomsResponse.data);
      
      console.log('Classrooms fetched:', classroomsResponse.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };  

  // Handle classroom selection change
  const handleClassroomChange = (e) => {
    setSelectedClassroom(e.target.value);
  };

  // Update worker role
  const handleUpdateRole = async () => {
    try {
      await axios.put(`http://localhost:8000/trabajadores/${selectedWorker}`, {
        tipo_trabajador: selectedRole
      });
      alert('¡Rol actualizado con éxito!');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol.');
    }
  };

  // Add permission for the selected classroom
  const handleAddPermission = async () => {
    try {
      // Check if the permission already exists
      const climatesResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/aula/${selectedClassroom}`);
      if (climatesResponse.data.length === 0) {
        alert('Esta aula aún no tiene climas asignados.');
        return;
      }

      const { Id_clima } = climatesResponse.data[0]; // Assuming the first climate is the one we want

      try {
        await axios.get(`http://localhost:8000/permisos/trabajador/${selectedWorker}/clima/${Id_clima}`);
        alert('Este permiso ya fue asignado.');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Permission does not exist, create it
          await axios.post('http://localhost:8000/permisos', {
            Id_clave_trabajador: selectedWorker,
            Id_clima
          });

          alert('¡Permiso agregado con éxito!');
          // Refresh permissions list
          const permissionsResponse = await axios.get(`http://localhost:8000/permisos/trabajador/${selectedWorker}`);
          const permissionsData = await Promise.all(permissionsResponse.data.map(async (perm) => {
            const climaResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${perm.Id_clima}`);
            const aulaResponse = await axios.get(`http://localhost:8000/aulas/${climaResponse.data.Id_aula}`);
            const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aulaResponse.data.Id_edificio}`);

            return {
              ...perm,
              clima: climaResponse.data,
              aula: aulaResponse.data,
              edificio: edificioResponse.data,
            };
          }));

          setPermissions(permissionsData);
        } else {
          console.error('Error checking permission existence:', error);
          alert('Error al verificar el permiso.');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Esta aula aún no tiene climas asignados.');
      } else {
        console.error('Error adding permission:', error);
        alert('Error al agregar el permiso.');
      }
    }
  };

  // Delete a specific permission
  const handleDeletePermission = async () => {
    try {
      await axios.delete(`http://localhost:8000/permisos/${permissionToDelete}`);
      alert('¡Permiso eliminado con éxito!');
      setShowDeleteModal(false);
      setPermissionToDelete(null);
      // Refresh permissions list
      const permissionsResponse = await axios.get(`http://localhost:8000/permisos/trabajador/${selectedWorker}`);
      const permissionsData = await Promise.all(permissionsResponse.data.map(async (perm) => {
        const climaResponse = await axios.get(`http://localhost:8000/ubicaciones-climas/clima/${perm.Id_clima}`);
        const aulaResponse = await axios.get(`http://localhost:8000/aulas/${climaResponse.data.Id_aula}`);
        const edificioResponse = await axios.get(`http://localhost:8000/edificios/${aulaResponse.data.Id_edificio}`);

        return {
          ...perm,
          clima: climaResponse.data,
          aula: aulaResponse.data,
          edificio: edificioResponse.data,
        };
      }));

      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error deleting permission:', error);
      alert('Error al eliminar el permiso.');
    }
  };

  // Delete all permissions for the selected worker
  const handleDeleteAllPermissions = async () => {
    try {
      await axios.delete(`http://localhost:8000/permisos/trabajador/${selectedWorker}`);
      alert('¡Todos los permisos eliminados con éxito!');
      setShowDeleteAllModal(false);
      // Refresh permissions list
      setPermissions([]);
    } catch (error) {
      console.error('Error deleting all permissions:', error);
      alert('Error al eliminar todos los permisos.');
    }
  };

  return (
    <Container>
      <h1>Actualizar Rol del Trabajador</h1>
      <Form>
        <Row className="align-items-center">
          <Col md={4}>
            <Form.Group controlId="formWorker">
              <Form.Label>Selecciona el Trabajador</Form.Label>
              <Form.Control as="select" onChange={handleWorkerChange} value={selectedWorker}>
                <option value="">Selecciona un trabajador</option>
                {workers.map(worker => (
                  <option key={worker.Id_clave_trabajador} value={worker.Id_clave_trabajador}>
                    {worker.Clave_trabajador} - {worker.Nombre_del_trabajador}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formRole">
              <Form.Label>Rol Actual</Form.Label>
              <Form.Control as="select" onChange={handleRoleChange} value={selectedRole}>
                {roles.map(role => (
                  <option key={role.Id_tipo_de_trabajador} value={role.Id_tipo_de_trabajador}>
                    {role.Tipo_trabajador}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={handleUpdateRole} className="w-100">
              Actualizar Rol
            </Button>
          </Col>
        </Row>

        {selectedWorker && (
          <>
            <Row className="mt-4 align-items-center">
              <Col md={4}>
                <Form.Group controlId="formBuilding">
                  <Form.Label>Selecciona el Edificio</Form.Label>
                  <Form.Control as="select" onChange={handleBuildingChange} value={selectedBuilding}>
                    <option value="">Selecciona un edificio</option>
                    {buildings.map(building => (
                      <option key={building.Id_edificio} value={building.Id_edificio}>
                        {building.Nombre_edificio}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formClassroom">
                  <Form.Label>Selecciona el Aula</Form.Label>
                  <Form.Control as="select" onChange={handleClassroomChange} value={selectedClassroom}>
                    <option value="">Selecciona un aula</option>
                    {classrooms.map(classroom => {
                      const building = buildings.find(b => b.Id_edificio === selectedBuilding);

                      // Verificar que el edificio se encontró
                      console.log('Building for selected building ID:', building);
                      
                      const buildingName = building ? building.Nombre_edificio : 'Desconocido';
                      
                      console.log('Classroom:', classroom);
                      
                      return (
                        <option key={classroom.Id_aula} value={classroom.Id_aula}>
                          Clima {buildingName} {classroom.Nombre_aula}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button variant="primary" onClick={handleAddPermission} className="w-100">
                  Agregar Permiso
                </Button>
              </Col>
            </Row>

            <h2 className="mt-4">Permisos del Trabajador</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Clima</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map(permission => (
                  <tr key={permission.Id_clima}>
                    <td>
                      Clima {permission.edificio.Nombre_edificio} {permission.aula.Nombre_aula}
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => {
                        setPermissionToDelete(permission.Id_permiso);
                        setShowDeleteModal(true);
                      }}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="danger" onClick={() => setShowDeleteAllModal(true)}>
              Eliminar Todos los Permisos
            </Button>
          </>
        )}
      </Form>

      {/* Modal de confirmación para eliminar un permiso */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este permiso?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeletePermission}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar todos los permisos */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar todos los permisos para este trabajador?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAllPermissions}>
            Eliminar Todos
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UpdateWorkerRole;
