// NavBar.js
import React from 'react';
import '../CSS/NavBar.css';
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
          <li className="nav-item"><a href="/acercade">Acerca de...</a></li>
          <li className="nav-item"><a href="/registro">Registro</a></li>
        </ul>
      </nav>
      <Outlet/>
    </div>
  );
}

export default NavBar;