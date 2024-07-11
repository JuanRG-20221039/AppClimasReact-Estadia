import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../CSS/StyleGeneralAdmin.css'

import '../../CSS/MenuLoginUser.css'

const PerfilUser = ({ idClaveTrabajador }) => {
  const [trabajador, setTrabajador] = useState(null);
  const [tiposTrabajadores, setTiposTrabajadores] = useState([]);

  useEffect(() => {
    const fetchTrabajador = async () => {
      try {
        const responseTrabajador = await axios.get(`http://localhost:8000/trabajadores/${idClaveTrabajador}`);
        setTrabajador(responseTrabajador.data);
      } catch (error) {
        console.error('Error fetching trabajador:', error);
      }
    };

    const fetchTiposTrabajadores = async () => {
      try {
        const responseTipos = await axios.get('http://localhost:8000/tiposTrabajadores');
        setTiposTrabajadores(responseTipos.data);
      } catch (error) {
        console.error('Error fetching tipos de trabajadores:', error);
      }
    };

    if (idClaveTrabajador) {
      fetchTrabajador();
    }
    
    fetchTiposTrabajadores();
  }, [idClaveTrabajador]);

  if (!trabajador || tiposTrabajadores.length === 0) {
    return <div className="text-center mt-4">Cargando...</div>;
  }

  // Función para obtener el nombre del tipo de trabajador
  const getTipoTrabajador = (idTipo) => {
    const tipo = tiposTrabajadores.find(tipo => tipo.Id_tipo_de_trabajador === idTipo);
    return tipo ? tipo.Tipo_trabajador : 'Desconocido';
  };

  return (
    <div className="container mt-4 ">
      <div className="fondoFixed"></div>
      <h2 className="text-center tituloComponente margen">Perfil de Usuario</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>Clave del Trabajador:</strong> {trabajador.Clave_trabajador}</p>
          <p><strong>Nombre:</strong> {trabajador.Nombre_del_trabajador}</p>
          <p><strong>Apellidos:</strong> {trabajador.Apellido_paterno} {trabajador.Apellido_materno}</p>
          <p><strong>Tipo de Trabajador:</strong> {getTipoTrabajador(trabajador.tipo_trabajador)}</p>
          <p><strong>Correo Electrónico:</strong> {trabajador.Correo}</p>
        </div>
      </div>
    </div>
  );
};

export default PerfilUser;
