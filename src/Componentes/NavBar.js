import React from 'react';
import '../CSS/NavBar.css'

const Home = () => {
  return (
    <div>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><a href="#inicio">Inicio</a></li>
          <li className="nav-item"><a href="#mision">Misión</a></li>
          <li className="nav-item"><a href="#vision">Visión</a></li>
          <li className="nav-item"><a href="#acerca-de">Acerca de...</a></li>
          <li className="nav-item"><a href="#registro">Registro</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;