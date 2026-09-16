import {type JSX, useState} from 'react'
import Greetings from '../components/Greetings/Greetings'
import Counter from '../components/Counter/Counter'
import Form from '../components/Form/Form'

const Ej28dia = (): JSX.Element => {
  const [name, setName] = useState<string>('')
  return (
    <div className="ej28dia flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
        <Greetings name={name} defaultName="Usuario" />
        <Counter />
        <Form name={name} onChange={setName} />
    </div>
  )
}

export default Ej28dia