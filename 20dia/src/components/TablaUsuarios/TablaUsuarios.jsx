const usuarios = [
  { id: 1, nombre: "Ana", edad: 28, ciudad: "Buenos Aires" },
  { id: 2, nombre: "Luis", edad: 34, ciudad: "Córdoba" },
  { id: 3, nombre: "María", edad: 25, ciudad: "Rosario" },
  { id: 4, nombre: "Diego", edad: 41, ciudad: "Mendoza" },
];

const TablaUsuarios = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-100">
            <th scope="col" className="px-4 py-3 font-semibold text-slate-700">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-slate-700">
              Edad
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-slate-700">
              Ciudad
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-800">
                {usuario.nombre}
              </td>
              <td className="px-4 py-3 text-slate-600">{usuario.edad}</td>
              <td className="px-4 py-3 text-slate-600">{usuario.ciudad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;
