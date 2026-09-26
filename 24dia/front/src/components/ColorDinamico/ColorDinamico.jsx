import { useState } from 'react';

// --- Nivel 1: Estilos con React ---

// 3. Estilos dinámicos con useState
function ColorDinamico() {
  const [esRojo, setEsRojo] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setEsRojo(!esRojo)}
      style={{
        backgroundColor: esRojo ? 'red' : 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      Ahora soy {esRojo ? 'rojo' : 'azul'} (haz clic)
    </button>
  );
}

export default ColorDinamico;
