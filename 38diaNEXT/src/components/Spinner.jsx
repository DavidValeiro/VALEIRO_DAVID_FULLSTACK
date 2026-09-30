export default function Spinner({ label = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-600">
      <span className="size-5 animate-spin rounded-full border-4 border-slate-950 border-t-[#e85d4a]" />
      <span className="text-sm font-black uppercase">{label}</span>
    </div>
  );
}