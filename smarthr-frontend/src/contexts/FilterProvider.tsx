import { createContext, useContext, useState } from "react";

type propType = {
  children: React.ReactNode;
};

type contextType = {
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  department: string;
  setDepartment: React.Dispatch<React.SetStateAction<string>>;
};

const defaultContext: contextType = {
  company: "",
  setCompany: () => {},
  department: "",
  setDepartment: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const FilterContext = createContext<contextType>(defaultContext);

const FilterProvider = ({ children }: propType) => {
  const [company, setCompany] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  return (
    <FilterContext.Provider
      value={{ company, setCompany, department, setDepartment }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilter = () => {
  return useContext(FilterContext);
};

export default FilterProvider;
