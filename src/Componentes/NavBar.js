// NavBar.js
import React from 'react';
//desgin del componente
import '../CSS/NavBar.css';
//importaciones para la navegacion mediante el router
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">Inicio</Link></li>
          <li className="nav-item"><Link to="/mision">Misión</Link></li>
          <li className="nav-item"><Link to="/vision">Visión</Link></li>
          <li className="nav-item"><Link to="/acercade">Acerca de...</Link></li>
          <li className="nav-item"><Link to="/registro">Registro</Link></li>
        </ul>
      </nav>
      <Outlet/>
    </div>
  );
}

export default NavBar;