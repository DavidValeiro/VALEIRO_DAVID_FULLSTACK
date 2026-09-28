import { useEffect, useState } from "react";

const ICON_OPTIONS = [
  "keyboard_capslock",
  "bolt",
  "battery_charging_full",
  "settings_input_component",
  "mouse",
  "sports_esports",
  "tune",
  "graphic_eq",
  "spatial_audio",
  "texture",
  "aspect_ratio",
  "layers",
  "water_drop",
  "memory",
  "sensors",
  "star",
  "verified",
  "eco",
  "rocket_launch",
  "security",
];

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "neu-input neu-pressed rounded-lg bg-surface-container-low px-sm py-xs font-body-md text-body-md text-on-background w-full";

function ProductEditModal({ product, onClose, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [subtitle, setSubtitle] = useState(product.subtitle ?? "");
  const [badge, setBadge] = useState(product.badge ?? "");
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [compareAtPrice, setCompareAtPrice] = useState(
    product.compareAtPrice != null ? String(product.compareAtPrice) : ""
  );
  const [rating, setRating] = useState(String(product.rating));
  const [reviews, setReviews] = useState(String(product.reviews));
  const [image, setImage] = useState(product.image);
  const [gallery, setGallery] = useState(() => product.images.slice(1));
  const [specs, setSpecs] = useState(() =>
    product.specs.map((spec) => ({ ...spec }))
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSpecChange = (index, field, value) =>
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );

  const handleGalleryChange = (index, value) =>
    setGallery((prev) =>
      prev.map((url, i) => (i === index ? value : url))
    );

  const handleSubmit = (event) => {
    event.preventDefault();

    const mainImage = image.trim();
    const images = [
      mainImage,
      ...gallery.map((url) => url.trim()).filter(Boolean),
    ];
    const cleanedSpecs = specs
      .filter((spec) => spec.label.trim() || spec.value.trim())
      .map((spec) => ({
        icon: spec.icon.trim(),
        label: spec.label.trim(),
        value: spec.value.trim(),
      }));

    onSave({
      ...product,
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parseFloat(price),
      compareAtPrice:
        compareAtPrice.trim() === "" ? undefined : parseFloat(compareAtPrice),
      rating: parseFloat(rating),
      reviews: parseInt(reviews, 10),
      image: mainImage,
      images,
      extraImages: images.slice(1),
      specs: cleanedSpecs,
    });
  };

  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Editar ${product.title}`}
        onClick={(event) => event.stopPropagation()}
        className="flex flex-col w-full max-w-2xl max-h-[calc(100dvh-3rem)] overflow-hidden rounded-2xl bg-surface-container neu-raised"
        style={{
          boxShadow:
            "8px 10px 28px rgba(0,0,0,0.6), -2px -2px 8px #2A2A2B, 0 0 48px rgba(244,150,56,0.05)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(100dvh-3rem)]">
          <header className="flex items-center justify-between px-margin-mobile py-md border-b border-surface-variant/40 shrink-0">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">edit</span>
              <h2 className="font-headline-md text-headline-md text-on-background">
                Editar producto
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
              aria-label="Cerrar editor"
            >
              close
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-margin-mobile py-md flex flex-col gap-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <Field label="Título">
                <input
                  className={inputCls}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  className={inputCls}
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              <Field label="Precio">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </Field>
              <Field label="Precio tachado">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(event) => setCompareAtPrice(event.target.value)}
                />
              </Field>
              <Field label="Valoración">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  required
                />
              </Field>
              <Field label="Reseñas">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="1"
                  value={reviews}
                  onChange={(event) => setReviews(event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <Field label="Badge">
                <input
                  className={inputCls}
                  value={badge}
                  onChange={(event) => setBadge(event.target.value)}
                  placeholder="Ej: NEW"
                />
              </Field>
              <Field label="Categoría">
                <input
                  className={inputCls}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                />
              </Field>
            </div>

            <Field label="Descripción">
              <textarea
                className={`${inputCls} min-h-28 resize-y`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </Field>

            <Field label="Imagen principal (URL)">
              <input
                className={inputCls}
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                required
              />
            </Field>

            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                  Galería (URLs)
                </span>
                <button
                  type="button"
                  onClick={() => setGallery((prev) => [...prev, ""])}
                  className="flex items-center gap-xs text-primary font-semibold font-body-md text-body-md hover:text-primary-fixed-dim transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir imagen
                </button>
              </div>
              {gallery.length === 0 && (
                <p className="font-body-md text-body-md text-secondary">
                  Sin imágenes extra.
                </p>
              )}
              {gallery.map((url, index) => (
                <div key={index} className="flex items-center gap-sm">
                  <input
                    className={inputCls}
                    type="url"
                    value={url}
                    onChange={(event) => handleGalleryChange(index, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setGallery((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="material-symbols-outlined text-secondary hover:text-error transition-all shrink-0"
                    aria-label={`Quitar imagen ${index + 1}`}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                  Especificaciones
                </span>
                <button
                  type="button"
                  onClick={() => setSpecs((prev) => [...prev, { icon: "", label: "", value: "" }])}
                  className="flex items-center gap-xs text-primary font-semibold font-body-md text-body-md hover:text-primary-fixed-dim transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  Añadir especificación
                </button>
              </div>
              {specs.length === 0 && (
                <p className="font-body-md text-body-md text-secondary">
                  Sin especificaciones.
                </p>
              )}
              <ul className="flex flex-col gap-sm">
                {specs.map((spec, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-sm"
                  >
                    <select
                      className={`${inputCls} max-w-28`}
                      value={spec.icon}
                      onChange={(event) =>
                        handleSpecChange(index, "icon", event.target.value)
                      }
                    >
                      <option value="">—</option>
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <input
                      className={inputCls}
                      placeholder="Etiqueta"
                      value={spec.label}
                      onChange={(event) =>
                        handleSpecChange(index, "label", event.target.value)
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Valor"
                      value={spec.value}
                      onChange={(event) =>
                        handleSpecChange(index, "value", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSpecs((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="material-symbols-outlined text-secondary hover:text-error transition-all shrink-0"
                      aria-label={`Quitar especificación ${index + 1}`}
                    >
                      delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <footer className="flex justify-end gap-sm px-margin-mobile py-md border-t border-surface-variant/40 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-surface-container-high text-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary font-body-md text-body-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary-container text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all font-body-md text-body-md"
            >
              Guardar cambios
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default ProductEditModal;