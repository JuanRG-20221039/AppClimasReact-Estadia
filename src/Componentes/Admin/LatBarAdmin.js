import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../CSS/MenuLoginAdmin.css';

const LatBarAdmin = () => {
  return (
    <aside className="sidebar" style={{ overflowY: 'auto' }}>
      <nav>
        <ul className='ulMargen'>
          <li><NavLink to="admin-edificios" activeClassName="active">Administrar Edificios</NavLink></li>
          <li><NavLink to="admin-aulas" activeClassName="active">Administrar Aulas</NavLink></li>
          <li><NavLink to="admin-aulas-horarios" activeClassName="active">Administrar Horarios de Aulas</NavLink></li>
          <li><NavLink to="admin-modulos-iot" activeClassName="active">Administrar Modulos IOT</NavLink></li>
          <li><NavLink to="admin-vinculacion-iot" activeClassName="active">Vincular Modulos IOT</NavLink></li>
          <li><NavLink to="admin-marcas" activeClassName="active">Administrar Marcas</NavLink></li>
          <li><NavLink to="admin-climas" activeClassName="active">Registro de Climas</NavLink></li>
          <li><NavLink to="admin-codigos" activeClassName="active">Registro de Codigos</NavLink></li>
          <li><NavLink to="admin-climas-ubicaciones" activeClassName="active">Administrar Ubicaciones</NavLink></li>
          <li><NavLink to="admin-reportes" activeClassName="active">Bandeja de Reportes</NavLink></li>
          <li><NavLink to="admin-permisos" activeClassName="active">Permisos de Usuarios</NavLink></li>
          <li><NavLink to="admin-historial" activeClassName="active">Historial de Acceso</NavLink></li>
          <li><NavLink to="admin-historialIOT" activeClassName="active">Historial IOT</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default LatBarAdmin;