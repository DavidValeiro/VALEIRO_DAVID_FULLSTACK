import Perfil from '../components/Perfil/Perfil'
import Product from '../components/Product/Product'
import Greeting from '../components/Greeting/Greeting'
import Button from '../components/Button/Button'
import Task from '../components/Task/Task'
import Avatar from '../components/Avatar/Avatar'
import './example.css'

function Example() {
  const userData = {
    name: 'David Valeiro',
    edad: 28
  }

  const productData = {
    name: 'Laptop',
    price: '$1000'
  }

  const greetingName = 'David'

  const taskData = {
    completed: true,
    description: 'Complete the project'
  }

  const avatarData = {
    image: 'https://en.meming.world/images/en/4/46/Staring_Avatar_Guy.jpg',
    name: 'Fish'
  }

  function handleButtonClick() {
    console.log('Button clicked! ')
  }

  return (
    <div className="example-container">
      <Perfil info={userData} />
      <Product info={productData} />
      <Greeting name={greetingName} />
      <Button onClick={handleButtonClick}>Press</Button>
      <Task info={taskData} />
      <Avatar info={avatarData} />
    </div>
  )
}

export default Example