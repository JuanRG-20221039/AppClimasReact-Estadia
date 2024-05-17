// Inicio.js
import React from 'react'
import NavBar from './NavBar'
import { Routes, Route } from 'react-router-dom';

import Login from './Login'
import Mision from './Mision'
import Vision from './Vision'
import Acercade from './Acercade';
import Registro from './Registro';

const Inicio = () => {
  return (
    <div>
      <NavBar/>
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