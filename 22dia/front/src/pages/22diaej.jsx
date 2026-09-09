import Counter from '../components/Counter/Counter'
import Switch from '../components/Switch/Switch'
import List from '../components/List/List'
import Text from '../components/Text/Text'
import Temporizador from '../components/Temporizador/Temporizador'
import RandomCounter from '../components/RandomCounter/RandomCounter'
import RandomBackground from '../components/RandomBack/RandomBack'
import './22diaej.css'
import { useState } from 'react'

function Page22diaej() {
    const [color, setColor] = useState('#ffffff')
  return (
    <div className="app-custom" style={{ backgroundColor: color }}>
        <h1>Página 22 día</h1>
        <Counter />
        <Switch />
        <List />
        <Text />
        <Temporizador />
        <RandomCounter />
        <RandomBackground />
    </div>
  )
}

export default Page22diaej