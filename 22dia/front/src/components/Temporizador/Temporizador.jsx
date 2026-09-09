import {useState, useEffect} from 'react'

const Temporizador = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo(prevTiempo => prevTiempo + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const [tiempo, setTiempo] = useState(0)

  return (
    <div>
      <p>{tiempo} segundos</p>
    </div>
  )

}

export default Temporizador