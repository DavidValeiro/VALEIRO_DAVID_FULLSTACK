import Producto from "./Producto";

const productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Celular", precio: 800 },
  { id: 3, nombre: "Tablet", precio: 500 },
];

const ListaProductos = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {productos.map((producto) => (
        <Producto
          key={producto.id}
          nombre={producto.nombre}
          precio={producto.precio}
        />
      ))}
    </div>
  );
};

export default ListaProductos;
