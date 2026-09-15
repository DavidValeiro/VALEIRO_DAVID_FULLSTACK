import {useRef, useState} from 'react';

const Incremental = () => {
    const countRender = useRef(0);
    const [count, setCount] = useState(0);

    countRender.current = countRender.current + 1;

    const incrementCount = () => {
        setCount(prev =>  prev + 1);
    }

  return (
    <div className="flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Contador: {count}</p>
        <p className="text-lg mb-4">Renderizados: {countRender.current}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={incrementCount}>Contador + 1</button>
    </div>
  );
}

export default Incremental;