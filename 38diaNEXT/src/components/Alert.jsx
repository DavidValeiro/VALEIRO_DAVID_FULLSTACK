export default function Alert({ message, tone = 'error' }) {
  if (!message) return null;

  const tones = {
    error: 'bg-[#e85d4a] text-white',
    success: 'bg-[#7AC74C] text-slate-950',
    info: 'bg-[#7dd3fc] text-slate-950'
  };

  return (
    <p
      role="alert"
      className={`rounded-xl border-4 border-slate-950 px-4 py-3 text-sm font-black shadow-[3px_3px_0_#172033] ${tones[tone]}`}
    >
      {message}
    </p>
  );
}