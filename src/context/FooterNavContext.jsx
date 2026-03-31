import { createContext, useContext } from "react";

export const FooterNavContext = createContext(null);

export function useFooterNav() {
  return useContext(FooterNavContext);
}