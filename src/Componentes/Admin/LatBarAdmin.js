import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../CSS/MenuLoginAdmin.css'; // Importa el archivo CSS para los estilos

const LatBarAdmin = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><NavLink to="admin-edificios" activeClassName="active">Administrar Edificios</NavLink></li>
          <li><NavLink to="admin-aulas" activeClassName="active">Administrar Aulas</NavLink></li>
          <li><NavLink to="admin-dispositivos" activeClassName="active">Administrar Dispositivos</NavLink></li>
          <li><NavLink to="admin-bitacora" activeClassName="active">Bitácora</NavLink></li>
          <li><NavLink to="admin-reportes" activeClassName="active">Reportes</NavLink></li>
          <li><NavLink to="admin-historial" activeClassName="active">Historial de Acceso</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default LatBarAdmin;
