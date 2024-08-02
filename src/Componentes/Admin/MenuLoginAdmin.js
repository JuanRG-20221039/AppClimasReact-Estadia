import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LatBarAdmin from './LatBarAdmin.js'; // Importa la barra lateral
import '../../CSS/MenuLoginAdmin.css'; // Importa el archivo CSS para los estilos

// Importa los componentes individuales
import Edificios from './ComponentesMenuAdmin/Edificios';
import Aulas from './ComponentesMenuAdmin/Aulas';
import Climas from './ComponentesMenuAdmin/Climas.js';
import Reportes from './ComponentesMenuAdmin/Reportes';
import Historial from './ComponentesMenuAdmin/Historial';
import Marcas from './ComponentesMenuAdmin/Marcas.js';
import ModulosIOT from './ComponentesMenuAdmin/ModulosIOT.js';
import VinculacionIOT from './ComponentesMenuAdmin/VinculacionIOT.js';
import Ubicaciones from './ComponentesMenuAdmin/Ubicaciones.js';
import Horarios from './ComponentesMenuAdmin/Horarios.js';
import CodigosClimas from './ComponentesMenuAdmin/CodigosClimas.js'
import Permisos from './ComponentesMenuAdmin/Permisos.js';
import HistoricoIOT from './ComponentesMenuAdmin/HistoricoIOT.js';
import TiposAulas from './ComponentesMenuAdmin/TiposAulas.js';
import TiposTrabajadores from './ComponentesMenuAdmin/TiposTrabajadores.js';

const MenuLoginAdmin = () => {
  return (
    <div className="admin-container">
      <LatBarAdmin />
      <main className="content"> {/* Aquí aplicamos el estilo para el scroll */}
        <Routes>
          <Route path="admin-edificios" element={<Edificios />} />
          <Route path="admin-tipos-aulas" element={<TiposAulas />} />
          <Route path="admin-aulas" element={<Aulas />} />
          <Route path="admin-aulas-horarios" element={<Horarios />} />
          <Route path="admin-marcas" element={<Marcas />} />
          <Route path="admin-modulos-iot" element={<ModulosIOT />} />
          <Route path="admin-vinculacion-iot" element={<VinculacionIOT />} />
          <Route path="admin-climas" element={<Climas />} />
          <Route path="admin-codigos" element={<CodigosClimas />} />
          <Route path="admin-climas-ubicaciones" element={<Ubicaciones />} />
          <Route path="admin-reportes" element={<Reportes />} />
          <Route path="admin-tipos-trabajadores" element={<TiposTrabajadores />} />
          <Route path="admin-permisos" element={<Permisos />} />
          <Route path="admin-historial" element={<Historial />} />
          <Route path="admin-historialIOT" element={<HistoricoIOT />} />
          <Route path="*" element={<Edificios />} />
        </Routes>
      </main>
    </div>
  );
};

export default MenuLoginAdmin;
