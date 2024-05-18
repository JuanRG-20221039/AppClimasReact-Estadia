// Inicio.js
import React from 'react'
import NavBar from './NavBar'
import { Routes, Route } from 'react-router-dom';

//importeaciones de los documentos para navegar mediante el router
import Login from './Login'
import Mision from './Mision'
import Vision from './Vision'
import Acercade from './Acercade';
import Registro from './Registro';

//funcion para el router
const Inicio = () => {
  return (
    <div>
      {/* se importa la barra de navegacion, lo unico que hace es la accion mediante la url */}
      <NavBar/>
      {/* Este es el router, manda el complemento a la url y llama al documento
      ya previamente importado para renderizarlo */}
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/mision" element={<Mision/>}></Route>
        <Route path="/vision" element={<Vision/>}></Route>
        <Route path="/acercade" element={<Acercade/>}></Route>
        <Route path="/registro" element={<Registro/>}></Route>
      </Routes>
    </div>
  )
}

export default Inicio;