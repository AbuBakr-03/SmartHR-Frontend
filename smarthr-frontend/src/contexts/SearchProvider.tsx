import React, { createContext, useContext, useState } from "react";

type proptype = {
  children: React.ReactNode;
};

type contextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const defaultContext: contextType = {
  query: "",
  setQuery: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const SearchContext = createContext<contextType>(defaultContext);
const SearchProvider = ({ children }: proptype) => {
  const [query, setQuery] = useState<string>("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  return useContext(SearchContext);
};
