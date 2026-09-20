import ProductCard from "../components/ProductCard/ProductCard";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const Cataloge = () => {
  const { addToCart } = useCart();

  return (
    <main className="max-w-7xl mx-auto px-margin-desktop py-lg">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg py-lg">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </section>
    </main>
  );
};

export default Cataloge;