import ProductCard from "../components/ProductCard/ProductCard";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { usePageMeta } from "../hooks/usePageMeta";

const Cataloge = () => {
  const { addToCart } = useCart();

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
        <p className="font-body-md text-body-md text-secondary mt-xs">
          Periféricos de precisión para escritorio profesional: teclados
          mecánicos, ratones ópticos, mandos, audio de estudio y herramientas de
          workflow.
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
