import './Avatar.css'

const Avatar = ({info}) => {
  return (
    <div>
        <figure className='avatar-container'>
            <img src={info.image} alt={info.name} />
        </figure>
        <h2 className='avatar-name'>{info.name}</h2>
    </div>
  )
}

export default Avatar