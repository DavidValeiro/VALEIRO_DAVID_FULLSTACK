import { useState } from "react";

const Carrousel = ({ photos }) => {
  const visibleSlides = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = photos.length - visibleSlides;

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
      {/* Contenedor de imágenes */}
      <div
        className="flex gap-4 transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
        }}
      >
        {photos.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-[calc(100%/3)] h-200 object-cover"
          />
        ))}
      </div>

      {/* Botón anterior */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 disabled:opacity-50"
      >
        ←
      </button>

      {/* Botón siguiente */}
      <button
        onClick={nextSlide}
        disabled={currentIndex === maxIndex}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
};

export default Carrousel;
