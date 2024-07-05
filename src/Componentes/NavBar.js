import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/NavBar.css';

const NavBar = ({ loggedIn, role, handleLogout }) => {
  return (
    <div>
      <nav className="navbar">
        <ul className="nav-list">
          {loggedIn && role === 'admin' && (
            <>
              <li className="nav-item"><Link to="/menuAdmin">Panel de Administrador</Link></li>
            </>
          )}
          {loggedIn && (
            <>
              <li className="nav-item"><Link to="/menu">Panel de control</Link></li>
              <li className="nav-item"><Link to="/reportar">Reportar</Link></li>
              <li className="nav-item"><Link to="/perfil">Perfil</Link></li>
              <li className="nav-item"><Link onClick={handleLogout}>Cerrar Sesión</Link></li>
            </>
          )}
          {!loggedIn && (
            <>
              <li className="nav-item"><Link to="/">Iniciar Sesión</Link></li>
              <li className="nav-item"><Link to="/mision">Misión</Link></li>
              <li className="nav-item"><Link to="/vision">Visión</Link></li>
              <li className="nav-item"><Link to="/acercade">UTHH</Link></li>
              <li className="nav-item"><Link to="/registro">Registro</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;