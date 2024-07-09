import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import MenuLoginUser from './User/MenuLoginUser';
import Login from './Publico/Login';
import Mision from './Publico/Mision';
import Vision from './Publico/Vision';
import Acercade from './Publico/Acercade';
import Registro from './Publico/Registro';
import PerfilUser from './User/PerfilUser';
import ReportesUser from './User/ReportesUser';
import MenuLoginAdmin from './Admin/MenuLoginAdmin'; // Importa MenuLoginAdmin

import '../CSS/Layout.css'

const Inicio = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión
  const [role, setRole] = useState(''); // Estado para el rol del usuario
  const [idClaveTrabajador, setIdClaveTrabajador] = useState(null); // Estado para almacenar Id_clave_trabajador

  const handleLogin = (userRole, idTrabajador) => {
    // Esta función se llamará cuando el usuario inicie sesión correctamente
    setLoggedIn(true);
    setRole(userRole); // Establece el rol del usuario
    setIdClaveTrabajador(idTrabajador); // Guarda el Id_clave_trabajador
  };

  const handleLogout = () => {
    // Esta función se llamará cuando el usuario cierre sesión
    setLoggedIn(false);
    setRole(''); // Resetea el rol del usuario
    setIdClaveTrabajador(null); // Resetea el Id_clave_trabajador
  };

  return (
    <div>
      <NavBar loggedIn={loggedIn} role={role} handleLogout={handleLogout} />
      <Routes>
        {/* VISTA PRINCIPAL DEPENDIENDO EL ROL QUE INGRESO */}
        <Route path="/" element={loggedIn ? <Navigate to={role === 'admin' ? "/menuAdmin" : "/menu"} /> : <Login handleLogin={handleLogin} />} />
        <Route path="/mision" element={<Mision />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/acercade" element={<Acercade />} />
        <Route path="/registro" element={<Registro />} />
        {loggedIn && (
          <>
            <Route path="/menu" element={<MenuLoginUser />} />
            <Route path="/reportar" element={<ReportesUser />} />
            {/* Pasar el Id_clave_trabajador como prop a PerfilUser */}
            <Route path="/perfil" element={<PerfilUser idClaveTrabajador={idClaveTrabajador} />} />
            {/* RUTAS PARA ADMINISTRADOR */}
            {role === 'admin' && <Route path="/menuAdmin/*" element={<MenuLoginAdmin />} />} {/* Utiliza MenuLoginAdmin */}
          </>
        )}
        {/* RUTA DE FALLA PARA CUALQUIER OTRA RUTA */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default Inicio;