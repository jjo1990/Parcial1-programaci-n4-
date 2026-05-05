import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/Navbar";
import { AppRouter } from "./router/AppRouter";

// El QueryClient es el cerebro de TanStack Query.
// Guarda la caché de todos los datos y decide cuándo refrescarlos.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // datos "frescos" por 30 segundos antes de refetch
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f3f4f6]">
          <Navbar />
          <main className="py-8">
            <AppRouter />
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
