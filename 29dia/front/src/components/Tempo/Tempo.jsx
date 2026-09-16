import {useState, useEffect, useRef} from 'react';

const Tempo = () => {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCount((currentCount) => currentCount + 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    const stopTimer = () => {
        clearInterval(intervalRef.current);
    };

    const startTimer = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setCount((currentCount) => currentCount + 1);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-lg mb-4">Contador: {count}</p>
            <p className="text-sm text-gray-500">Este es un contador que se actualiza cada segundo</p>
            <div className="flex gap-4">
                <button type="button" onClick={stopTimer} className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
                    Detener
                </button>
                <button type="button" onClick={startTimer} className="mt-4 rounded bg-green-500 px-4 py-2 text-white">
                    Iniciar
                </button>
            </div>

        </div>
    );
}

export default Tempo;