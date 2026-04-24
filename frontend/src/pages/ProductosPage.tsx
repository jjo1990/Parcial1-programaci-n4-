import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { productosAPI, categoriasAPI, ingredientesAPI } from "../api";
import type { Producto, ProductoCreate } from "../types";

interface ModalProps {
  inicial?: Producto;
  onClose: () => void;
  onGuardar: (data: ProductoCreate) => void;
  cargando: boolean;
}

function ProductoModal({ inicial, onClose, onGuardar, cargando }: ModalProps) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [precioBase, setPrecioBase] = useState(inicial?.precio_base ?? 0);
  const [stockCantidad, setStockCantidad] = useState(inicial?.stock_cantidad ?? 0);
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  // Por ahora permitimos seleccionar una, pero la mandamos como lista
  const [categoriaId, setCategoriaId] = useState<number | undefined>(inicial?.categorias[0]?.id);
  const [ingSeleccionados, setIngSeleccionados] = useState<Set<number>>(
    new Set(inicial?.ingredientes.map((i) => i.id) ?? [])
  );

  const { data: categorias = [] } = useQuery({ queryKey: ["categorias"], queryFn: categoriasAPI.listar });
  const { data: ingredientes = [] } = useQuery({ queryKey: ["ingredientes"], queryFn: ingredientesAPI.listar });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {inicial ? "Editar producto" : "Nuevo producto"}
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
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Precio ($)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition"
                value={precioBase}
                onChange={(e) => setPrecioBase(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition"
                value={stockCantidad}
                onChange={(e) => setStockCantidad(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white appearance-none"
              value={categoriaId ?? ""}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition placeholder:text-gray-300 min-h-[80px]"
              placeholder="Descripción del producto"
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
              precio_base: precioBase,
              stock_cantidad: stockCantidad,
              descripcion: descripcion || undefined,
              categoria_ids: categoriaId ? [categoriaId] : [],
              ingrediente_ids: Array.from(ingSeleccionados),
            })}
            disabled={!nombre || precioBase <= 0 || cargando}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition"
          >
            {cargando ? "Guardando..." : inicial ? "Guardar" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | undefined>();
  const [filtro, setFiltro] = useState("");

  const { data: productos = [], isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: productosAPI.listar,
  });

  const crearMutation = useMutation({
    mutationFn: productosAPI.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setModalAbierto(false);
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) =>
      productosAPI.actualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setEditando(undefined);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: productosAPI.eliminar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const handleGuardar = (data: ProductoCreate) => {
    if (editando) {
      editarMutation.mutate({ id: editando.id, data });
    } else {
      crearMutation.mutate(data);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    p.categorias.some(c => c.nombre.toLowerCase().includes(filtro.toLowerCase()))
  );

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Cargando productos...</p>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Error al cargar productos.</p>
      </div>
    </div>
  );

  return (
    <div className="px-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-400 text-sm font-medium">{productosFiltrados.length} resultados</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Nuevo
        </button>
      </div>

      <div className="mb-6 relative group">
        <input
          type="text"
          placeholder="Buscar productos por nombre o categoría..."
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition placeholder:text-gray-400"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-3">
              {p.categorias && p.categorias.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {p.categorias.map(cat => (
                    <span
                      key={cat.id}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider bg-blue-500"
                    >
                      {cat.nombre}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-300 bg-gray-50 uppercase tracking-wider border border-gray-100">
                  Sin Cat.
                </span>
              )}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditando(p)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => eliminarMutation.mutate(p.id)}
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4 cursor-pointer" onClick={() => navigate(`/productos/${p.id}`)}>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{p.nombre}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem] mt-1 leading-relaxed">
                {p.descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="font-bold text-gray-900">${p.precio_base.toLocaleString('es-AR')}</span>
              <div className="flex items-center">
                {p.stock_cantidad === 0 ? (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">Sin stock</span>
                ) : p.stock_cantidad < 10 ? (
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{p.stock_cantidad} uds.</span>
                ) : (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">{p.stock_cantidad} uds.</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-medium">No se encontraron productos.</p>
        </div>
      )}


      {(modalAbierto || editando) && (
        <ProductoModal
          inicial={editando}
          onClose={() => { setModalAbierto(false); setEditando(undefined); }}
          onGuardar={handleGuardar}
          cargando={crearMutation.isPending || editarMutation.isPending}
        />
      )}
    </div>
  );
}

