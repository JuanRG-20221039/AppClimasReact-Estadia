import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/NavBar.css';

const NavBar = ({ loggedIn, handleLogout }) => {
  return (
    <div>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">Inicio</Link></li>
          {loggedIn && (
            <>
              <li className="nav-item"><Link to="/perfil">Perfil</Link></li>
              <li className="nav-item"><Link to="/configuracion">Configuración</Link></li>
              <li className="nav-item"><Link to="/mas">Más</Link></li>
              <li className="nav-item"><Link onClick={handleLogout}>Cerrar Sesión</Link></li>
            </>
          )}
          {!loggedIn && (
            <>
              <li className="nav-item"><Link to="/mision">Misión</Link></li>
              <li className="nav-item"><Link to="/vision">Visión</Link></li>
              <li className="nav-item"><Link to="/acercade">Acerca de...</Link></li>
              <li className="nav-item"><Link to="/registro">Registro</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
