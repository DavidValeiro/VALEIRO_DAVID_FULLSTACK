import { useCurrency } from "../../context/CurrencyContext";

const ProductManageList = ({ product, onEdit, onDelete }) => {
  const { format } = useCurrency();
  return (
    <div className="flex h-20 items-center bg-surface-container-high rounded-xl p-xs neu-raised justify-around gap-sm">
      <img
        src={product.image}
        alt={product.title}
        className="w-50 h-16 object-cover rounded-md"
      />
      <h2 className="font-body-lg text-body-lg text-on-background truncate px-sm">
        {product.title}
      </h2>
      <p className="font-body-md text-body-md text-primary">
        <data
          value={product.price}
          className="text-primary font-bold text-headline-md inline-block h-6"
        >
          {format(product.price)}
        </data>
      </p>
      <div className="flex justify-between gap-xs">
        <button
          onClick={() => onEdit(product.id)}
          className="bg-primary-container text-on-primary font-semibold px-sm py-xs rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-error-container text-on-error font-semibold px-sm py-xs rounded-lg neu-raised neu-btn-active transition-all hover:bg-error"
        >
          Delete
        </button>
      </div>
    </div>
  );
};



export default ProductManageList;
