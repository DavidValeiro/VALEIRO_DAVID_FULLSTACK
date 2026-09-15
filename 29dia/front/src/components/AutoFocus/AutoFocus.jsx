import {useRef, useEffect} from 'react';

const AutoFocus = () => {
  const inputRef = useRef(null);

  function handleButtonClick() {
    inputRef.current?.focus();
  }

  function ChangeColor() {
    if (inputRef.current?.style.backgroundColor === 'yellow') {
      inputRef.current.style.backgroundColor = 'white';
    } else {
      inputRef.current.style.backgroundColor = 'yellow';
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center">
        <input ref={inputRef} type="text" placeholder="Escribe algo..." className="border p-2 rounded" autoFocus />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={handleButtonClick}>Enviar</button>
        <button className="ml-2 p-2 bg-yellow-500 text-white rounded" onClick={ChangeColor}>Cambiar Color</button>
    </div>
  );
}

export default AutoFocus;