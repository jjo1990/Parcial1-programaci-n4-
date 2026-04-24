import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriasAPI } from "../api";
import type { Categoria, CategoriaCreate } from "../types";

interface ModalProps {
  inicial?: Categoria;
  onClose: () => void;
  onGuardar: (data: CategoriaCreate) => void;
  cargando: boolean;
}

function CategoriaModal({ inicial, onClose, onGuardar, cargando }: ModalProps) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [imagenUrl, setImagenUrl] = useState(inicial?.imagen_url ?? "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {inicial ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition placeholder:text-gray-300"
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Imagen URL</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition placeholder:text-gray-300"
              placeholder="URL de la imagen"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition placeholder:text-gray-300 min-h-[80px]"
              placeholder="Breve descripción de la categoría"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onGuardar({ 
              nombre, 
              descripcion: descripcion || undefined,
              imagen_url: imagenUrl || undefined,
            })}
            disabled={!nombre || cargando}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition"
          >
            {cargando ? "Guardando..." : inicial ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriasPage() {
  const queryClient = useQueryClient();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | undefined>();

  const { data: categorias = [], isLoading, isError } = useQuery({
    queryKey: ["categorias"],
    queryFn: categoriasAPI.listar,
  });

  const crearMutation = useMutation({
    mutationFn: categoriasAPI.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setModalAbierto(false);
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriaCreate> }) =>
      categoriasAPI.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setCategoriaEditar(undefined);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: categoriasAPI.eliminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const handleGuardar = (data: CategoriaCreate) => {
    if (categoriaEditar) {
      editarMutation.mutate({ id: categoriaEditar.id, data });
    } else {
      crearMutation.mutate(data);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Cargando categorías...</p>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Error al cargar categorías.</p>
      </div>
    </div>
  );

  return (
    <div className="px-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-400 text-sm font-medium">{categorias.length} categorías en total</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Nueva
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción</th>
              <th className="text-center px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    {cat.imagen_url && (
                      <img src={cat.imagen_url} alt={cat.nombre} className="w-8 h-8 rounded-lg object-cover" />
                    )}
                    <span className="font-bold text-gray-900">{cat.nombre}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-gray-500 font-medium">{cat.descripcion ?? "—"}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => setCategoriaEditar(cat)} 
                      className="text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarMutation.mutate(cat.id)} 
                      className="text-red-400 hover:text-red-600 font-semibold transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categorias.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium">No hay categorías registradas.</p>
          </div>
        )}
      </div>

      {(modalAbierto || categoriaEditar) && (
        <CategoriaModal
          inicial={categoriaEditar}
          onClose={() => { setModalAbierto(false); setCategoriaEditar(undefined); }}
          onGuardar={handleGuardar}
          cargando={crearMutation.isPending || editarMutation.isPending}
        />
      )}
    </div>
  );
}

