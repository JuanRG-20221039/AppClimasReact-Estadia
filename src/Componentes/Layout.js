import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import MenuLogin from './MenuLogin'; // Importa el componente MenuLogin
import Login from './Login';
import Mision from './Mision';
import Vision from './Vision';
import Acercade from './Acercade';
import Registro from './Registro';

const Inicio = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión

  const handleLogin = () => {
    // Esta función se llamará cuando el usuario inicie sesión correctamente
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Esta función se llamará cuando el usuario cierre sesión
    setLoggedIn(false);
  };

  return (
    <div>
      {/* Se pasa el estado loggedIn y la función handleLogout al componente NavBar */}
      <NavBar loggedIn={loggedIn} handleLogout={handleLogout} />
      {/* Este es el router, manda el componente a la URL y renderiza el componente correspondiente */}
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/menu" /> : <Login handleLogin={handleLogin} />} />
        <Route path="/mision" element={<Mision />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/acercade" element={<Acercade />} />
        <Route path="/registro" element={<Registro />} />
        {loggedIn ? (
          <Route path="/menu" element={<MenuLogin />} />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
};

export default Inicio;