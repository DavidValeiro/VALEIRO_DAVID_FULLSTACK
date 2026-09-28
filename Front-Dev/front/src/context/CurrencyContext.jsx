import { createContext, useContext, useMemo, useState } from "react";
import { CURRENCIES, currency as formatCurrency } from "../utils/currency";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState("EUR");

  const value = useMemo(
    () => ({
      currencyCode,
      setCurrencyCode,
      options: Object.values(CURRENCIES),
      format: (number) => formatCurrency(number, currencyCode),
    }),
    [currencyCode]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}