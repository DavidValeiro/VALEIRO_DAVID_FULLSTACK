// --- Nivel 1: Estilos con React ---

// --- Objetos de estilos reutilizables (fuera del componente) ---

const styles = {
  titulo: {
    color: 'blue',
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
  },
  botonVerde: {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
};

// 1. Inline Styles + 2. objeto `styles`
function InlineStyles() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 style={styles.titulo}>Estilos con React</h1>
      <button type="button" style={styles.botonVerde}>
        Soy un botón verde
      </button>
    </div>
  );
}

export default InlineStyles;
