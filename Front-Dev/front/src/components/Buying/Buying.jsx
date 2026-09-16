import { currency } from "../../utils/currency";

function CartRow({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <li className="buying-row neu-flat rounded-xl px-margin-mobile py-md flex flex-col gap-sm">
      <div className="flex items-center justify-between gap-md">
        <span className="font-body-md text-body-md text-on-background flex-1 min-w-0 truncate">
          {item.name}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="material-symbols-outlined text-secondary hover:text-error transition-all p-base shrink-0"
          aria-label={`Remove ${item.name}`}
        >
          delete
        </button>
      </div>

      <div className="flex items-center justify-between gap-md">
        <span className="font-label-sm text-label-sm text-secondary uppercase shrink-0">
          {currency(item.price)}
        </span>

        <div className="flex items-center neu-pressed rounded-full shrink-0">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all px-sm py-sm"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            remove
          </button>
          <span className="font-body-md text-body-md text-on-background min-w-6 text-center">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => onIncrement(item.id)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all px-sm py-sm"
            aria-label={`Increase quantity of ${item.name}`}
          >
            add
          </button>
        </div>

        <span className="font-body-md text-body-md text-primary shrink-0">
          {currency(item.price * item.qty)}
        </span>
      </div>
    </li>
  );
}

function Buying({
  open = false,
  onClose,
  items = defaultItems,
  setItems,
  showOverlay = true,
}) {
  const increment = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  const decrement = (id) =>
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );

  const remove = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {showOverlay && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      <aside
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 h-screen w-[min(24rem,100vw)] flex flex-col bg-surface-container shadow-[4px_4px_10px_#000000,-2px_-2px_6px_#2A2A2B] transition-all duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-margin-mobile py-md border-b border-surface-variant/40">
          <div className="flex items-center space-x-sm">
            <span className="material-symbols-outlined text-primary">
              shopping_cart
            </span>
            <h2 className="font-headline-md text-headline-md text-on-background">
              Carrito
            </h2>
            {items.length > 0 && (
              <span className="font-label-sm text-label-sm text-on-primary bg-primary rounded-full px-sm py-xs">
                {items.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
            aria-label="Close shopping cart"
          >
            close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-md px-margin-mobile text-center">
            <span className="material-symbols-outlined text-secondary text-5xl">
              shopping_basket
            </span>
            <p className="font-body-md text-body-md text-secondary">
              Tu carrito está vacío.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-margin-mobile py-md space-y-md">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={remove}
                />
              ))}
            </ul>

            <footer className="border-t border-surface-variant/40 px-margin-mobile py-md flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-secondary">
                  Total
                </span>
                <span className="font-display-lg text-display-lg text-primary font-bold">
                  {currency(total)}
                </span>
              </div>
              <button
                type="button"
                className="material-symbols-outlined font-body-md text-body-md text-on-primary bg-primary hover:bg-primary-fixed-dim transition-all py-md rounded-full"
              >
                Comprar
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

export default Buying;