import { useCart } from "../../context/CartContext";

const CartToast = () => {
  const { lastAdded } = useCart();
  const visible = Boolean(lastAdded);
  const product = lastAdded?.product;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`absolute top-full right-0 mt-2.5 z-50 flex w-[min(19rem,calc(100vw-1.5rem))] items-center gap-sm rounded-xl border border-surface-variant/40 bg-surface-container px-margin-mobile py-sm shadow-[6px_6px_16px_#000000,-2px_-2px_6px_#2A2A2B] transition-all duration-300 ease-out motion-reduce:transition-none max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[6.5rem] max-sm:mt-0 max-sm:w-[calc(100vw-1.5rem)] ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {product && (
        <img
          src={product.images[0]}
          alt=""
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
        />
      )}
      <span className="flex min-w-0 flex-col">
        <span className="font-label-sm text-label-sm uppercase text-primary">
          Añadido al carrito
        </span>
        <span className="truncate font-body-md text-body-md text-on-background">
          {product ? product.title : ""}
        </span>
      </span>
      <span className="material-symbols-outlined ml-auto shrink-0 text-primary">
        check_circle
      </span>
    </div>
  );
};

export default CartToast;
