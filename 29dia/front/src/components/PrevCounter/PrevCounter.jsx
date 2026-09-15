import {useRef, useState} from 'react';


const PrevCounter = () => {
    const prevCount = useRef(0);
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        prevCount.current = count;
        setCount(prev =>  prev + 1);
    }

  return (
    <div className="flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Contador: {count}</p>
        <p className="text-lg mb-4">Contador anterior: {prevCount.current}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={incrementCount}>Contador + 1</button>
    </div>
  );
}

export default PrevCounter; 