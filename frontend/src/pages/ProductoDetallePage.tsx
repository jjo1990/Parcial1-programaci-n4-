import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productosAPI } from "../api";

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ["productos", id],
    queryFn: () => productosAPI.obtener(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Cargando producto...</p>
    </div>
  );

  if (isError || !producto) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4 text-center">
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 max-w-sm">
        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xl font-bold mb-2">Producto no encontrado</p>
        <p className="text-red-400 mb-6">El producto que buscás no existe o fue eliminado.</p>
        <button 
          onClick={() => navigate("/productos")} 
          className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition"
        >
          Volver a productos
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/productos")}
        className="text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-2 font-bold transition group text-sm"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Volver
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {producto.categorias && producto.categorias.map(cat => (
                  <span 
                    key={cat.id}
                    className="px-3 py-1 rounded-md text-white text-[10px] font-bold shadow-sm bg-blue-500"
                  >
                    {cat.nombre}
                  </span>
                ))}
                <span className={`px-3 py-1 rounded-md text-[10px] font-bold border ${producto.disponible ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  {producto.disponible ? "Disponible" : "No disponible"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{producto.nombre}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue-600 mb-0.5">
                ${producto.precio_base.toLocaleString('es-AR')}
              </p>
              <p className={`text-xs font-bold ${producto.stock_cantidad < 10 ? 'text-orange-500' : 'text-gray-400'}`}>
                {producto.stock_cantidad} unidades
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              {producto.descripcion || "Sin descripción proporcionada."}
            </p>
          </div>

          <div className="border-t border-gray-50 pt-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ingredientes utilizados</h2>
            {producto.ingredientes.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Este producto no tiene ingredientes asignados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {producto.ingredientes.map((ing) => (
                  <div key={ing.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{ing.nombre}</p>
                      {ing.es_alergeno && (
                         <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">Alérgeno</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

