// --- Nivel 2: Interacciones y estilos dinámicos ---

// --- Objeto de estilo base reutilizable (fuera del componente) ---

const baseStyle = {
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

// 5. Combinación de estilos: baseStyle + operador ...spread
function BotonConBaseStyle() {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" style={{ ...baseStyle, backgroundColor: 'teal' }}>
        Spread + teal
      </button>
      <button type="button" style={{ ...baseStyle, backgroundColor: 'purple' }}>
        Spread + purple
      </button>
      <button type="button" style={{ ...baseStyle, backgroundColor: 'crimson' }}>
        Spread + crimson
      </button>
    </div>
  );
}

export default BotonConBaseStyle;
