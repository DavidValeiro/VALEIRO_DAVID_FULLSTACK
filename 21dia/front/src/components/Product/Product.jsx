import './Product.css'

const Product = ({info}) => {
  return (
    <ul className='product-container'>
        <li>{info.name}</li>
        <li>{info.price}</li>
    </ul>
  )
}

export default Product