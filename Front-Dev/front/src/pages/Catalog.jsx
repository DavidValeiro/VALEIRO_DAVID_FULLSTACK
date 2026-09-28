import ProductCard from "../components/ProductCard/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { usePageMeta } from "../hooks/usePageMeta";

const Cataloge = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  usePageMeta({
    title: "Catálogo",
    description: `Explora los ${products.length} periféricos de MOUSIN: teclados mecánicos, ratones ópticos, mandos, audio de estudio y herramientas de escritorio con hardware de grado profesional.`,
    image: products[0].image,
  });

  return (
    <main className="max-w-7xl mx-auto px-margin-desktop py-lg">
      <header className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-background tracking-tight">
          Catálogo
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Explora la selección de periféricos de MOUSIN: hardware de grado profesional.
        </p>
      </header>

      <section
        aria-label="Listado de productos"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg"
      >
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
