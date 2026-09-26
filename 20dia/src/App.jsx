import ListaFrutas from "./components/ListaFrutas/ListaFrutas";
import ListaProductos from "./components/Producto/ListaProductos";
import TablaUsuarios from "./components/TablaUsuarios/TablaUsuarios";

function App() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 p-8">
      <h1 className="text-3xl font-bold text-slate-900">.map() en React</h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          1. Lista de frutas
        </h2>
        <ListaFrutas />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          2. Lista de productos
        </h2>
        <ListaProductos />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          3. Tabla de usuarios
        </h2>
        <TablaUsuarios />
      </section>
    </main>
  );
}

export default App;
