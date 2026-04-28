import { createContext, useContext, useState, useEffect } from "react";
import { useList } from "../../hooks/useList.js";

const ListContext = createContext(null);


export default function ListProvider({ children }) {
      const listSate = useList();

      return (
            <ListContext.Provider value={listSate}>
                  {children}
            </ListContext.Provider>
      )

}


export function userListContext() {
      const ctx = useContext(ListContext);
      if (!ctx) throw new Error('UseListContext must be used inside <ListProvider>');
      return ctx;
}