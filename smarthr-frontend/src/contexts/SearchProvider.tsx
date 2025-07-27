import { createContext, useContext, useState } from "react";

type proptype = {
  children: React.ReactNode;
};

type searchContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const defaultSearchContext: searchContextType = {
  query: "",
  setQuery: () => {},
};

export const SearchContext =
  createContext<searchContextType>(defaultSearchContext);

const SearchProvider = ({ children }: proptype) => {
  const [query, setQuery] = useState<string>("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;

export const useSearch = () => {
  return useContext(SearchContext);
};
