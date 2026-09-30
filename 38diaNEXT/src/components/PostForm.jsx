'use client';

import { useState } from 'react';
import Alert from '@/components/Alert';
import { MAX_IMAGE_BYTES, readImageAsBase64 } from '@/lib/format';

const EMPTY = { title: '', description: '', image: '' };

const inputClass =
  'w-full rounded-xl border-4 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#172033] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ffcb05]';

export default function PostForm({ initialValues = EMPTY, submitLabel = 'Publicar', onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initialValues?._id);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('La imagen no puede pesar más de 5 MB');
      return;
    }

    try {
      const base64 = await readImageAsBase64(file);
      setValues((prev) => ({ ...prev, image: base64 }));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim() || !values.description.trim() || !values.image) {
      setError('El título, la descripción y la imagen son obligatorios');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        image: values.image
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reveal-stagger flex flex-col gap-5">
      <Alert message={error} />

      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Título
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={handleChange('title')}
          placeholder="Escribe un título"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500"
        >
          Descripción
        </label>
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={handleChange('description')}
          placeholder="Cuenta lo que quieras contar"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="image" className="mb-1 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Imagen {isEdit ? '(opcional: reemplaza la actual)' : ''}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full text-sm font-bold text-slate-600 file:mr-3 file:rounded-xl file:border-4 file:border-slate-950 file:bg-white file:px-4 file:py-2 file:text-sm file:font-black file:uppercase file:text-slate-950 file:shadow-[3px_3px_0_#172033] hover:file:bg-[#ffcb05]"
        />
        <p className="mt-1 text-xs font-bold text-slate-500">Máximo 5 MB. Se envía a la API en Base64.</p>
        {values.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.image}
            alt="Vista previa"
            className="mt-2 h-40 w-full rounded-2xl border-4 border-slate-950 object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-xl border-4 border-slate-950 bg-[#ffcb05] px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1 hover:bg-[#ffd740] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? 'Guardando…' : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border-4 border-slate-950 bg-white px-5 py-3 text-lg font-black uppercase text-slate-950 shadow-[4px_4px_0_#172033] transition hover:-translate-y-1"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
