import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slugify";
import { useCurrency } from "../../context/CurrencyContext";

const ProductCard = ({ product, onAddToCart }) => {
  const detailTo = `/Producto/${toSlug(product.title)}`;
  const { format } = useCurrency();

  return (
    <article className="bg-surface-container-high rounded-xl p-md neu-raised neu-card-hover group">
      <Link
        to={detailTo}
        className="relative block w-full aspect-square rounded-lg overflow-hidden bg-surface-container mb-md"
        aria-label={`Ver detalle de ${product.title}`}
      >
        <img
          className="w-full h-full object-cover"
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
        {product.badge && (
          <p className="absolute top-3 right-3">
            <span className="bg-primary-container text-on-primary font-bold px-sm py-xs rounded text-label-sm">
              {product.badge}
            </span>
          </p>
        )}
      </Link>

      <div className="flex flex-col min-w-0">
        <Link
          to={detailTo}
          className="flex flex-col min-w-0 hover:opacity-80 transition-opacity"
        >
          <h2 className="font-headline-md text-headline-md text-on-surface truncate">
            {product.title}
          </h2>
          <p className="font-body-md text-body-md text-secondary truncate">
            {product.subtitle}
          </p>
        </Link>

        <p className="shrink-0 pt-md">
          <data value={product.price} className="text-primary font-bold text-headline-md">
            {format(product.price)}
          </data>
        </p>

        <div className="flex flex-wrap gap-sm shrink-0 pt-md">
          <Link
            to={detailTo}
            className="bg-surface-container-highest text-primary font-semibold px-md py-sm rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary flex-1 text-center"
          >
            View Detail
          </Link>
          <button
            type="button"
            onClick={onAddToCart}
            className="bg-primary-container text-on-primary font-semibold px-md py-sm rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary flex-1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
