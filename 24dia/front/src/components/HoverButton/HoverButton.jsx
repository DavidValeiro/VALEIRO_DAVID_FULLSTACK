import { useState } from 'react';

// --- Nivel 2: Interacciones y estilos dinámicos ---

// 4. Hover con inline styles (onMouseEnter / onMouseLeave)
function HoverButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? 'orange' : 'slategray',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }}
    >
      {isHovered ? 'El mouse está encima' : 'Pasa el mouse por encima'}
    </button>
  );
}

export default HoverButton;
