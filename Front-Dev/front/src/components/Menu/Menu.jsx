import { useState } from "react";

const defaultNavItems = [
  { label: "Home", href: "#" },
  { label: "Catálogo", href: "#" },
  { label: "Añadir Producto", href: "#", active: true },
];

function NavLinks({ items, onNavigate }) {
  return items.map((item, index) => {
    const baseClasses =
      "font-body-md text-body-md transition-colors duration-300 py-1";

    if (item.active) {
      return (
        <a
          key={index}
          className={`${baseClasses} text-primary font-bold border-b-2 border-primary transition-all`}
          href={item.href}
          onClick={onNavigate}
        >
          {item.label}
        </a>
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
  onCartClick,
  onAccountClick,
}) {
  const [open, setOpen] = useState(false);

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
            <button
              type="button"
              onClick={onCartClick}
              className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
              aria-label="Shopping cart"
            >
              shopping_cart
            </button>
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
        className="md:hidden bg-surface-container overflow-hidden transition-all duration-300 border-t border-surface-variant/20"
        style={{ maxHeight: open ? "300px" : "0" }}
      >
        <div className="flex flex-col px-margin-mobile py-sm space-y-xs">
          <NavLinks items={navItems} onNavigate={close} />
        </div>
      </nav>
    </header>
  );
}

export default Menu;
