import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchProvider from "./contexts/SearchProvider.tsx";
import FilterProvider from "./contexts/FilterProvider.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
