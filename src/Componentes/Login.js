import React from 'react';
import '../CSS/Login.css';

const Login = ({ handleLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para verificar credenciales
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email === 'yolo@gmail.com' && password === 'asdasd123123') {
      handleLogin(); // Llama a handleLogin si las credenciales son válidas
    } else {
      alert('Correo electrónico o contraseña incorrectos');
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center">Iniciar Sesión</h3>
                <form onSubmit={handleSubmit}>
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
  );
};

export default Login;