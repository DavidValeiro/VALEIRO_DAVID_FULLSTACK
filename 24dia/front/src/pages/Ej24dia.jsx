import Section from '../components/Section/Section';
import InlineStyles from '../components/InlineStyles/InlineStyles';
import ColorDinamico from '../components/ColorDinamico/ColorDinamico';
import HoverButton from '../components/HoverButton/HoverButton';
import BotonConBaseStyle from '../components/BotonConBaseStyle/BotonConBaseStyle';
import TextoResponsivo from '../components/TextoResponsivo/TextoResponsivo';

function Ej24dia() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">24dia</h1>
        <p className="text-slate-600">Estilos en React: inline styles y dinámicos</p>
      </header>

      <h2 className="mt-2 text-xl font-semibold text-slate-800">
        Nivel 1: Estilos con React
      </h2>
      <Section
        titulo="1 y 2. Inline Styles con un objeto de estilos"
        descripcion="El <h1> y el <button> toman su estilo del objeto 'styles'."
      >
        <InlineStyles />
      </Section>
      <Section
        titulo="3. Estilos dinámicos con useState"
        descripcion="El color de fondo alterna entre rojo y azul en cada clic."
      >
        <ColorDinamico />
      </Section>

      <h2 className="mt-2 text-xl font-semibold text-slate-800">
        Nivel 2: Interacciones y estilos dinámicos
      </h2>
      <Section
        titulo="4. Hover con inline styles"
        descripcion="onMouseEnter y onMouseLeave cambian el color al pasar el mouse."
      >
        <HoverButton />
      </Section>
      <Section
        titulo="5. Combinación de estilos"
        descripcion="baseStyle se combina con el operador ...spread para cambiar solo el color."
      >
        <BotonConBaseStyle />
      </Section>
      <Section
        titulo="6. Estilos responsivos"
        descripcion="El color del texto depende de window.innerWidth (límite: 600px)."
      >
        <TextoResponsivo />
      </Section>
    </main>
  );
}

export default Ej24dia;
