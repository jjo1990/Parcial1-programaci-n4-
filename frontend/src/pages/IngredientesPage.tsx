import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredientesAPI } from "../api";
import type { Ingrediente, IngredienteCreate } from "../types";

interface ModalProps {
  inicial?: Ingrediente;
  onClose: () => void;
  onGuardar: (data: IngredienteCreate) => void;
  cargando: boolean;
}

function IngredienteModal({ inicial, onClose, onGuardar, cargando }: ModalProps) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [esAlergeno, setEsAlergeno] = useState(inicial?.es_alergeno ?? false);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {inicial ? "Editar ingrediente" : "Nuevo ingrediente"}
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
              placeholder="Nombre del ingrediente"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition placeholder:text-gray-300 min-h-[80px]"
              placeholder="Breve descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="es_alergeno"
              checked={esAlergeno}
              onChange={(e) => setEsAlergeno(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="es_alergeno" className="text-sm font-medium text-gray-700">¿Es alérgeno?</label>
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
            onClick={() => onGuardar({ nombre, descripcion: descripcion || undefined, es_alergeno: esAlergeno })}
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

export default function IngredientesPage() {
  const queryClient = useQueryClient();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Ingrediente | undefined>();

  const { data: ingredientes = [], isLoading, isError } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: ingredientesAPI.listar,
  });

  const crearMutation = useMutation({
    mutationFn: ingredientesAPI.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModalAbierto(false);
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IngredienteCreate> }) =>
      ingredientesAPI.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setEditando(undefined);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: ingredientesAPI.eliminar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] }),
  });

  const handleGuardar = (data: IngredienteCreate) => {
    if (editando) {
      editarMutation.mutate({ id: editando.id, data });
    } else {
      crearMutation.mutate(data);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Cargando ingredientes...</p>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Error al cargar ingredientes.</p>
      </div>
    </div>
  );

  return (
    <div className="px-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredientes</h1>
          <p className="text-gray-400 text-sm font-medium">{ingredientes.length} ingredientes en total</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Nuevo
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción</th>
              <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="text-center px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ingredientes.map((ing) => (
              <tr key={ing.id} className="hover:bg-gray-50/50 transition">
                <td className="px-8 py-5">
                  <span className="font-bold text-gray-900">{ing.nombre}</span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-gray-500 font-medium">{ing.descripcion ?? "—"}</span>
                </td>
                <td className="px-8 py-5">
                   {ing.es_alergeno && (
                     <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">Alérgeno</span>
                   )}
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => setEditando(ing)} 
                      className="text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarMutation.mutate(ing.id)} 
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
        {ingredientes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium">No hay ingredientes registrados.</p>
          </div>
        )}
      </div>

      {(modalAbierto || editando) && (
        <IngredienteModal
          inicial={editando}
          onClose={() => { setModalAbierto(false); setEditando(undefined); }}
          onGuardar={handleGuardar}
          cargando={crearMutation.isPending || editarMutation.isPending}
        />
      )}
    </div>
  );
}

