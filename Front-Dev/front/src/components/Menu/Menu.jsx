import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Buying from "../Buying/Buying";
import CartToast from "../CartToast/CartToast";

const defaultNavItems = [
  { label: "Home", href: "#" },
  { label: "Catálogo", to: "/", active: true },
  { label: "Añadir Producto", href: "#" },
];

function NavLinks({ items, onNavigate }) {
  return items.map((item, index) => {
    const baseClasses =
      "font-body-md text-body-md transition-colors duration-300 py-1";

    if (item.active) {
      return (
        <Link
          key={index}
          className={`${baseClasses} text-primary font-bold border-b-2 border-primary transition-all`}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      );
    }

    if (item.to) {
      return (
        <Link
          key={index}
          className={`${baseClasses} text-secondary hover:text-primary-fixed-dim`}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <a
        key={index}
        className={`${baseClasses} text-secondary hover:text-primary-fixed-dim`}
        href={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  });
}

function Menu({
  brand = "MOUSIN",
  navItems = defaultNavItems,
  showCart = true,
  showAccount = true,
  onAccountClick,
}) {
  const [open, setOpen] = useState(false);
  const { openCart, items, lastAdded } = useCart();

  const close = () => setOpen(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-background shadow-[4px_4px_10px_#000000,-2px_-2px_6px_#2A2A2B]">
      <div className="flex w-full justify-between items-center w-full px-margin-desktop py-md">
        <div className="font-display-lg text-display-lg font-bold tracking-tighter text-primary">
          {brand}
        </div>
        <nav className="hidden md:flex items-center space-x-lg">
          <NavLinks items={navItems} />
        </nav>
        <div className="flex items-center space-x-md">
          {showCart && (
            <div className="relative">
              <button
                type="button"
                onClick={() => openCart()}
                className="p-base neu-button-raised rounded-full text-secondary hover:text-primary transition-all"
                aria-label={
                  items.length > 0
                    ? `Shopping cart, ${items.length} artículos`
                    : "Shopping cart"
                }
              >
                <span
                  key={lastAdded?.seq ?? 0}
                  className={`material-symbols-outlined block ${
                    lastAdded ? "animate-cart-bump" : ""
                  }`}
                >
                  shopping_cart
                </span>
                {items.length > 0 && (
                  <span className="buying-count absolute -top-0.5 -right-0.5">
                    {items.length}
                  </span>
                )}
              </button>
              <Buying />
              <CartToast />
            </div>
          )}
          {showAccount && (
            <button
              type="button"
              onClick={onAccountClick}
              className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
              aria-label="Account"
            >
              account_circle
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? "close" : "menu"}
          </button>
        </div>
      </div>
      <nav
        className={`md:hidden bg-surface-container grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] border-t border-surface-variant/20" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={`overflow-hidden min-h-0 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col px-margin-mobile py-sm space-y-xs">
            <NavLinks items={navItems} onNavigate={close} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Menu;
