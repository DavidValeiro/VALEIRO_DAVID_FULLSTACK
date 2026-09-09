import {useEffect, useState} from 'react'

const RandomCounter = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + Math.floor(Math.random() * 100))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <p>{count}</p>
    </div>
  )
}

export default RandomCounter