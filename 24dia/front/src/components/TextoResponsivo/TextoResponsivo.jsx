import { useEffect, useState } from 'react';

// --- Nivel 2: Interacciones y estilos dinámicos ---

// 6. Estilos responsivos con window.innerWidth
function TextoResponsivo() {
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setAncho(window.innerWidth);

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const esMovil = ancho < 600;

  return (
    <div className="flex flex-col items-start gap-2">
      <p
        style={{
          color: esMovil ? 'crimson' : 'seagreen',
          fontSize: '1.1rem',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {esMovil
          ? 'Ventana pequeña (< 600px): texto en rojo'
          : 'Ventana grande (>= 600px): texto en verde'}
      </p>
      <span className="text-sm text-slate-500">
        Ancho actual: {ancho}px — redimensiona la ventana
      </span>
    </div>
  );
}

export default TextoResponsivo;
