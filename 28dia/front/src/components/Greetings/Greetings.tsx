import {type JSX} from 'react'

interface GreetingsProps {
  name: string, defaultName?: string
}

const Greetings: React.FC<GreetingsProps> =  ({ name, defaultName }: GreetingsProps): JSX.Element => {
  return (
    <div className="greetings bg-blue-100 p-4 w-fit rounded-lg shadow-md hover:bg-blue-200" >
      <p>Hola, {name || defaultName}!</p>
    </div>
  )
}

export default Greetings