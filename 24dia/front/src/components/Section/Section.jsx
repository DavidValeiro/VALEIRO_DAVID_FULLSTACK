function Section({ titulo, descripcion, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
      <p className="mt-1 mb-5 text-sm text-slate-500">{descripcion}</p>
      {children}
    </section>
  );
}

export default Section;
