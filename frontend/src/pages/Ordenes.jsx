import { useEffect, useState } from 'react'
import { getOrdenes, createOrden, procesarPendientes } from '../services/ordenes'
import { getUsuarios } from '../services/usuarios'
import { getRestaurantes } from '../services/restaurantes'
import OrdenCard from '../components/OrdenCard'

const emptyItem = { nombre: '', precioUnitario: '', cantidad: 1 }

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [usuarioId, setUsuarioId] = useState('')
  const [restauranteId, setRestauranteId] = useState('')
  const [items, setItems] = useState([{ ...emptyItem }])
  const [error, setError] = useState(null)

  const cargar = () => {
    setLoading(true)
    Promise.all([getOrdenes(), getUsuarios(), getRestaurantes()])
      .then(([o, u, r]) => {
        setOrdenes(o.data || [])
        setUsuarios(u.data || [])
        setRestaurantes(r.data || [])
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const updateItem = (i, field, value) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      usuario_id: usuarioId,
      restaurante_id: restauranteId,
      items: items.map((it) => ({
        nombre: it.nombre,
        precio_unitario: parseFloat(it.precioUnitario),
        cantidad: parseInt(it.cantidad),
      })),
    }
    try {
      await createOrden(payload)
      setShowForm(false)
      setItems([{ ...emptyItem }])
      cargar()
    } catch {
      alert('Error al crear orden')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Órdenes</h1>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              if (!confirm('¿Pasar todas las órdenes pendientes a "procesando"?')) return
              try { await procesarPendientes(); cargar() } catch { alert('Error al procesar') }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Procesar Pendientes
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
          >
            {showForm ? 'Cancelar' : '+ Nueva Orden'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Usuario</label>
              <select required value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Seleccionar usuario</option>
                {usuarios.map((u) => (
                  <option key={u._id} value={u._id}>{u.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Restaurante</label>
              <select required value={restauranteId} onChange={(e) => setRestauranteId(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Seleccionar restaurante</option>
                {restaurantes.map((r) => (
                  <option key={r._id} value={r._id}>{r.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Items</p>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 flex-wrap">
                <input placeholder="Nombre del plato" value={item.nombre} onChange={(e) => updateItem(i, 'nombre', e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-32 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input placeholder="Precio" type="number" value={item.precioUnitario} onChange={(e) => updateItem(i, 'precioUnitario', e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input placeholder="Cant." type="number" min="1" value={item.cantidad} onChange={(e) => updateItem(i, 'cantidad', e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {items.length > 1 && (
                  <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
                    className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setItems([...items, { ...emptyItem }])}
              className="text-sm text-orange-600 hover:underline">+ Agregar item</button>
          </div>

          <button type="submit" className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-sm">
            Crear Orden
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : ordenes.length === 0 ? (
        <p className="text-gray-400">No hay órdenes registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordenes.map((o) => (
            <OrdenCard key={o._id} orden={o} onRefresh={cargar} />
          ))}
        </div>
      )}
    </div>
  )
}
