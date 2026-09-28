import { createContext, useContext, useMemo, useState } from "react";
import { products as initialProducts } from "../data/products";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => initialProducts);

  const updateProduct = (updated) =>
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updated.id ? updated : product
      )
    );

  const value = useMemo(
    () => ({ products, updateProduct }),
    [products]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}