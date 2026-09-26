import { currency } from "../../utils/currency";
import { useCart } from "../../context/CartContext";

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

function Buying({ showOverlay = false }) {
  const {
    open,
    closeCart,
    items,
    increment,
    decrement,
    remove,
    total,
  } = useCart();

  return (
    <>
      {showOverlay ? (
        <div
          aria-hidden="true"
          onClick={closeCart}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ) : (
        open && (
          <div aria-hidden="true" onClick={closeCart} className="fixed inset-0 z-40" />
        )
      )}

      <div
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute top-full right-0 mt-2.5 z-50 flex flex-col overflow-hidden rounded-2xl w-[min(22rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)] bg-surface-container border border-surface-variant/30 transition-all duration-300 ease-out origin-top-right motion-reduce:transition-none max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[6.5rem] max-sm:mt-0 max-sm:w-[calc(100vw-1.5rem)] ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
        style={{
          boxShadow:
            "8px 10px 28px rgba(0,0,0,0.6), -2px -2px 8px #2A2A2B, 0 0 48px rgba(244,150,56,0.05)",
        }}
      >
        {/* 6.5rem = alto del header; por debajo de sm el panel se ancla a la pantalla, no al boton */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] bg-surface-container border-l border-t border-surface-variant/40 max-sm:hidden"
        />

        <header className="flex items-center justify-between px-margin-mobile py-md border-b border-surface-variant/40">
          <div className="flex items-center space-x-sm">
            <span className="material-symbols-outlined text-primary">
              shopping_cart
            </span>
            <p className="font-headline-md text-headline-md text-on-background">
              Carrito
            </p>
            {items.length > 0 && (
              <span className="font-label-sm text-label-sm text-on-primary bg-primary rounded-full px-sm py-xs">
                {items.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
            aria-label="Close shopping cart"
          >
            close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-md px-margin-mobile py-lg text-center">
            <span className="material-symbols-outlined text-secondary text-5xl">
              shopping_basket
            </span>
            <p className="font-body-md text-body-md text-secondary">
              Tu carrito está vacío.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-margin-mobile py-md space-y-md max-h-[60dvh]">
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
      </div>
    </>
  );
}

export default Buying;