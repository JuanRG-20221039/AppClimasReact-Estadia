import React from 'react'
import '../CSS/Login.css'
import NavBar from './NavBar'

export default function Login() {
  return (
    <div>
      <NavBar/>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center">Iniciar Sesión</h3>
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" placeholder="Ingresa tu contraseña" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}