import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CategoriasPage from "./pages/CategoriasPage";
import IngredientesPage from "./pages/IngredientesPage";
import ProductosPage from "./pages/ProductosPage";
import ProductoDetallePage from "./pages/ProductoDetallePage";

// El QueryClient es el cerebro de TanStack Query.
// Guarda la caché de todos los datos y decide cuándo refrescarlos.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // datos "frescos" por 30 segundos antes de refetch
    },
  },
});

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition text-sm";
  const activeClass = "text-white opacity-100";
  const inactiveClass = "text-white/70 hover:text-white";

  const links = [
    { to: "/productos", label: "producto" },
    { to: "/categorias", label: "categoria" },
    { to: "/ingredientes", label: "ingredientes" },
  ];

  return (
    <nav className="bg-[#1e2532] px-6 md:px-12 py-5 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-2xl tracking-tight">mi tienda</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => `${baseClasses} ${isActive ? activeClass : inactiveClass}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-all"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-1 pb-4">
          {links.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f3f4f6]">
          <Navbar />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<ProductosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/ingredientes" element={<IngredientesPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/productos/:id" element={<ProductoDetallePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
