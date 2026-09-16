import { currency } from "../../utils/currency";

const ProductCard = ({
  product,
  onViewDetail,
  onAddToCart,
}) => {
  return (
    <div className="bg-surface-container-high rounded-xl p-md neu-raised neu-card-hover group">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container mb-md">
        <img
          className="w-full h-full object-cover"
          src={product.image}
          alt={product.title}
        />
        {product.badge && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary-container text-on-primary font-bold px-sm py-xs rounded text-label-sm">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-md text-headline-md text-on-surface truncate">
            {product.title}
          </h3>
          <p className="font-body-md text-body-md text-secondary truncate">
            {product.subtitle}
          </p>
        </div>

        <span className="text-primary font-bold text-headline-md shrink-0 pt-md">
          {currency(product.price)}
        </span>

        <div className="flex flex-wrap gap-sm shrink-0 pt-md">
          <button
            type="button"
            onClick={onViewDetail}
            className="bg-surface-container-highest text-primary font-semibold px-md py-sm rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary flex-1"
          >
            View Detail
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            className="bg-primary-container text-on-primary font-semibold px-md py-sm rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary flex-1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;