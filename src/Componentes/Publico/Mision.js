import React from 'react';
import '../../CSS/Mision.css'; // Asegúrate de importar el archivo CSS

const Mision = () => {
  return (
    <div className="mision-background">
      <div className="container mt-4 mision-content">
        <h2>Nuestra Misión</h2>
        <p>
          Nuestra misión es implementar un sistema integral de control y monitoreo centralizado del aire climatizado en la Universidad Tecnológica de la Huasteca Hidalguense (UTHH), con el propósito de optimizar el consumo de energía y mejorar la gestión de recursos. Nos comprometemos a desarrollar una solución tecnológica innovadora que permita:
        </p>
        <ul>
          <li><strong>Eficiencia Energética:</strong> Reducir significativamente el consumo de energía mediante la regulación precisa y automatizada de los sistemas de aire acondicionado en toda la institución.</li>
          <li><strong>Gestión Centralizada:</strong> Facilitar el control remoto y la supervisión en tiempo real de todos los equipos de climatización desde una plataforma centralizada, mejorando la capacidad de respuesta ante emergencias y cambios ambientales.</li>
          <li><strong>Optimización de Recursos:</strong> Maximizar el uso efectivo de los aparatos de climatización para evitar costos operativos elevados y prolongar la vida útil de los equipos.</li>
          <li><strong>Sostenibilidad Ambiental:</strong> Contribuir al cuidado del medio ambiente mediante la reducción de la huella de carbono asociada al consumo energético excesivo.</li>
        </ul>
        <p>
          Mediante esta iniciativa, buscamos transformar el entorno universitario hacia prácticas más sostenibles y eficientes, promoviendo un ambiente confortable y adecuado para el aprendizaje y el desarrollo académico en la UTHH.
        </p>
      </div>
    </div>
  );
};

export default Mision;