const Producto = ({ nombre, precio }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{nombre}</h3>
      <p className="mt-1 text-2xl font-bold text-sky-600">
        ${precio.toLocaleString("es-AR")}
      </p>
    </article>
  );
};

export default Producto;
