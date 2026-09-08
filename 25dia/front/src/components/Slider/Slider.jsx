import { useState, useEffect } from 'react';

const Slider = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        return () => clearInterval();
    }, [images.length]);

    return (
        <div className="slider-container w-full max-w-3xl mx-auto relative overflow-hidden rounded-xl shadow-lg z-0">
            <div
                className="slider-image w-full h-150 flex z-0 transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full shrink-0 object-cover"
                    />
                ))}
            </div>
            <button onClick={prevSlide} className="slider-button prev-button absolute left-5 top-1/2 z-10 text-white text-4xl">&lt;</button>
            <button onClick={nextSlide} className="slider-button next-button absolute right-5 top-1/2 z-10 text-white text-4xl">&gt;</button>

            <div className="slider-indicators absolute bottom-4 flex space-x-2 z-10 left-1/2">
                {images.map((_, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full indicator ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                ))}
            </div>
        </div>
    );
};

export default Slider;