import React from 'react';
import axios from 'axios';
import md5 from 'md5';

const Login = ({ handleLogin }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = md5(document.getElementById('password').value); // Encriptar la contraseña con MD5

    try {
      // Intentar iniciar sesión
      const loginResponse = await axios.post('http://localhost:8000/trabajadores/loginCorreo', {
        Correo: email,
        Contraseña: password,
      });

      if (loginResponse.status === 200) {
        // Si la autenticación es exitosa, obtener los detalles del trabajador por su correo electrónico
        const trabajadorResponse = await axios.get(`http://localhost:8000/trabajadores/correo/${email}`);

        if (trabajadorResponse.status === 200) {
          const trabajador = trabajadorResponse.data;
          if (trabajador.id_perfil === 1) {
            handleLogin('admin', trabajador.Id_clave_trabajador); // Administrador
          } else if (trabajador.id_perfil === 2) {
            handleLogin('user', trabajador.Id_clave_trabajador); // Usuario normal
          } else {
            alert('Perfil de usuario no reconocido');
          }
        } else {
          alert('No se pudieron obtener los detalles del trabajador');
        }
      } else {
        alert('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
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
                    <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" placeholder="Ingresa tu contraseña" required />
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
