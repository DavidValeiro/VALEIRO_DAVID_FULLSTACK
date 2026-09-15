import AutoFocus from '../components/AutoFocus/AutoFocus.jsx';
import Cards from '../components/Cards/Cards.jsx';
import Incremental from '../components/Incremental/Incremental.jsx';
import PrevCounter from '../components/PrevCounter/PrevCounter.jsx';
import Tempo from '../components/Tempo/Tempo.jsx';

function Ej29dia() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h1 className="text-3xl font-bold mb-4">Ejercicios del día 29</h1>
        <Cards title="1" exercise={<AutoFocus />} />
        <Cards title="2" exercise={<Incremental />} />
        <Cards title="3" exercise={<PrevCounter />} />
        <Cards title="4" exercise={<Tempo />} />
    </div>
  );
}

export default Ej29dia;