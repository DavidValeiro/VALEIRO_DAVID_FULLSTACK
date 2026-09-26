const frutas = ["Manzana", "Banana", "Cereza", "Durazno", "Fresa"];

const ListaFrutas = () => {
  return (
    <ul className="flex flex-wrap gap-3">
      {frutas.map((fruta) => (
        <li
          key={fruta}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
        >
          {fruta}
        </li>
      ))}
    </ul>
  );
};

export default ListaFrutas;
